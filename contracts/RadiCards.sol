pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

import "./Strings.sol";
import "./Medianizer.sol";

/**
* @title Radi.Cards
*
* @author blockrocket.tech (smart contracts)
* @author cryptodecks.co
* @author knownorigin.io
* @author pheme.app
* @author d1labs.com
* @author mbdoesthings.com
* @author chrismaree.io (smart contracts update)
*/
contract RadiCards is ERC721Token, Whitelist {
  using SafeMath for uint256;


  // dai support
  StandardToken daiContract;
  Medianizer medianizerContract;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public tokenIdPointer = 0;

  struct Benefactor {
    address ethAddress;
    string name;
    string website;
    string logo;
  }

  struct CardDesign {
    string tokenURI;
    bool active;
    uint minted;
    uint maxQnty; //set to zero for unlimited
    //minimum price per card set in Atto (SI prefix for 1x10-18 dai)
    uint256 minPrice; //set to zero to default to the minimumContribution
  }

// claimable link support
  enum Statuses { Empty, Deposited, Claimed, Cancelled }
  uint256 public EPHEMERAL_ADDRESS_FEE = 0.01 ether;
  mapping(address => uint256) public ephemeralWalletCards; // ephemeral wallet => tokenId

  struct RadiCard {
    address gifter;
    string message;
    bool daiDonation;
    uint256 giftAmount;
    uint256 donationAmount;
    Statuses status;
    uint256 cardIndex;
    uint256 benefactorIndex;
  }

  mapping(uint256 => Benefactor) public benefactors;
  uint256[] internal benefactorsIndex;

  mapping(uint256 => CardDesign) public cards;
  uint256[] internal cardsIndex;

  mapping(uint256 => RadiCard) public tokenIdToRadiCardIndex;

  //total gifted/donated in ETH
  uint256 public totalGiftedInWei;
  uint256 public totalDonatedInWei;

  //total gifted/donated in DAI
  uint256 public totalGiftedInAtto; //SI prefix for 1x10-18 dai is Atto.
  uint256 public totalDonatedInAtto;

  event CardGifted(
    address indexed _to,
    uint256 indexed _benefactorIndex,
    uint256 indexed _cardIndex,
    address _from,
    uint256 _tokenId,
    Statuses status
  );

  event LogClaim(
		 address indexed ephemeralAddress,
		 address indexed sender,
		 uint tokenId,
		 address receiver,
		 uint giftAmount,
     bool daiDonation
  );

  event LogCancel(
    address indexed ephemeralAddress,
    address indexed sender,
    uint tokenId
  );


  event BenefactorAdded(
    uint256 indexed _benefactorIndex
  );

  event CardAdded(
    uint256 indexed _cardIndex
  );

  constructor () public ERC721Token("RadiCards", "RADI") {
    addAddressToWhitelist(msg.sender);
  }

  function gift(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, uint256 _donationAmount, uint256 _giftAmount, bool _claimableLink) payable public returns (bool) {
    require(to != address(0), "Must be a valid address");
    require(benefactors[_benefactorIndex].ethAddress != address(0), "Must specify existing benefactor");
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].active, "Must be an active card");

    Statuses _giftStatus;
    address _sentToAddress;

    if(_claimableLink){
      require(_donationAmount + _giftAmount + EPHEMERAL_ADDRESS_FEE == msg.value, "Can only request to donate and gift the amount of ether sent + Ephemeral fee");
      _giftStatus = Statuses.Deposited;
      _sentToAddress = this;
      ephemeralWalletCards[to] = tokenIdPointer;
      to.transfer(EPHEMERAL_ADDRESS_FEE);
    }

    else {
      require(_donationAmount + _giftAmount == msg.value,"Can only request to donate and gift the amount of ether sent");
      _giftStatus = Statuses.Claimed;
      _sentToAddress = to;
    }

    if (cards[_cardIndex].maxQnty > 0){ //the max quantity is set to zero to indicate no limit. Only need to check that can mint if limited
      require(cards[_cardIndex].minted < cards[_cardIndex].maxQnty, "Can't exceed maximum quantity of card type");
    }

    if(cards[_cardIndex].minPrice > 0){ //if the card has a minimum price check that enough has been sent
      // Convert the current value of the eth send to a USD value of atto (1 usd = 10^18 atto).
      // require(getEthUsdValue(msg.value) >= (cards[_cardIndex].minPrice), "Must send at least the minimum amount");
      require (getMinCardPriceInWei(_cardIndex)<=msg.value,"Must send at least the minimum amount to buy card");
    }

    tokenIdToRadiCardIndex[tokenIdPointer] = RadiCard({
        gifter : msg.sender,
        message : _message,
        daiDonation: false,
        giftAmount : _giftAmount,
        donationAmount: _donationAmount,
        status: _giftStatus,
        cardIndex : _cardIndex,
        benefactorIndex : _benefactorIndex
    });

    uint256 _tokenId = _mint(_sentToAddress, cards[_cardIndex].tokenURI);

    cards[_cardIndex].minted++;

    // transfer the ETH to the benefactor
    if(_donationAmount > 0){
      benefactors[_benefactorIndex].ethAddress.transfer(_donationAmount);
    }
    // transfer gift to recipient.
    // note that we only do this if the link is not claimable as if it is the eth sits in escrow within this contract
    if(_giftAmount > 0 && !_claimableLink){
        _sentToAddress.transfer(_giftAmount);
    }

    // tally up the total eth gifted and donated
    totalGiftedInWei = totalGiftedInWei.add(_giftAmount);
    totalDonatedInWei = totalDonatedInWei.add(_donationAmount);

    emit CardGifted(_sentToAddress, _benefactorIndex, _cardIndex, msg.sender, _tokenId, _giftStatus);

    return true;
  }

  function giftInDai(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, uint256 _donationAmount, uint256 _giftAmount, bool _claimableLink) public payable returns (bool) {
    require(to != address(0), "Must be a valid address");
    require(benefactors[_benefactorIndex].ethAddress != address(0), "Must specify existing benefactor");
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].active, "Must be an active card");
    require((_donationAmount + _giftAmount)<= daiContract.allowance(msg.sender, this), "Must have provided high enough alowance to Radicard contract");
    require((_donationAmount + _giftAmount)<= daiContract.balanceOf(msg.sender), "Must have enough token balance of dai to pay for donation and gift amount");

    if (cards[_cardIndex].maxQnty > 0){ //the max quantity is set to zero to indicate no limit. Only need to check that can mint if limited
      require(cards[_cardIndex].minted < cards[_cardIndex].maxQnty, "Can't exceed maximum quantity of card type");
    }

    if(cards[_cardIndex].minPrice > 0){ //if the card has a minimum price check that enough has been sent
      require((_donationAmount + _giftAmount) >= cards[_cardIndex].minPrice, "The total dai sent with the transaction is less than the min price of the token");
    }

    //parameters that change based on the if the card is setup as with a claimable link
    Statuses _giftStatus;
    address _sentToAddress;

    if(_claimableLink){
      require(msg.value == EPHEMERAL_ADDRESS_FEE, "A claimable link was generated but not enough ephemeral ether was sent!");
      _giftStatus = Statuses.Deposited;
      _sentToAddress = this;
      // need to store the address of the ephemeral account and the card that it owns for claimable link functionality
      ephemeralWalletCards[to] = tokenIdPointer;
      to.transfer(EPHEMERAL_ADDRESS_FEE);
    }

    else {
      _giftStatus = Statuses.Claimed;
      _sentToAddress = to;
    }

    tokenIdToRadiCardIndex[tokenIdPointer] = RadiCard({
        gifter : msg.sender,
        message : _message,
        daiDonation: true,
        giftAmount : _giftAmount,
        donationAmount: _donationAmount,
        status: _giftStatus,
        cardIndex : _cardIndex,
        benefactorIndex : _benefactorIndex
    });

    // Card is minted to the _sentToAddress. This is either this radicards contract(if claimableLink==true)
    // and the creator chose to use the escrow for a claimable link or to the recipient EOA directly
    uint256 _tokenId = _mint(_sentToAddress, cards[_cardIndex].tokenURI);

    cards[_cardIndex].minted++;

    // transfer the DAI to the benefactor
    if(_donationAmount > 0){
        address _benefactorAddress = benefactors[_benefactorIndex].ethAddress;
        require(daiContract.transferFrom(msg.sender, _benefactorAddress, _donationAmount),"Sending to charity failed");
    }

    // transfer gift to recipient. note that this pattern is slightly different from the eth case as irrespective of
    // if it is a claimable link or not we preform the transaction. if it is indeed a claimable link the dai is sent
    // to the contract and held in escrow
    if(_giftAmount > 0){
        require(daiContract.transferFrom(msg.sender, _sentToAddress, _giftAmount),"Sending to recipaint failed");
    }

    // tally up the total eth gifted and donated
    totalGiftedInAtto = totalGiftedInAtto.add(_giftAmount);
    totalDonatedInAtto = totalDonatedInAtto.add(_donationAmount);

    emit CardGifted(_sentToAddress, _benefactorIndex, _cardIndex, msg.sender, _tokenId, _giftStatus);

    return true;

  }

  function _mint(address to, string tokenURI) internal returns (uint256 _tokenId) {
    uint256 tokenId = tokenIdPointer;

    super._mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

    tokenIdPointer = tokenIdPointer.add(1);

    return tokenId;
  }

  function cancelGift(address _ephemeralAddress) public returns (bool success) {

    uint256 tokenId = ephemeralWalletCards[_ephemeralAddress];
    require(tokenId != 0, "Can only call this function on an address that was used as an ephemeral");
    RadiCard storage card = tokenIdToRadiCardIndex[tokenId];

    // is deposited and wasn't claimed or cancelled before
    require(card.status == Statuses.Deposited, "can only cancel gifts that are unclaimed (deposited)");

    // only gifter can cancel transfer;
    require(msg.sender == card.gifter, "only the gifter of the card can cancel a gift");

    // update status to cancelled
    card.status = Statuses.Cancelled;

    // transfer optional ether or dai back to creators address
    if (card.giftAmount > 0) {
        if(card.daiDonation){
            require(daiContract.transfer(msg.sender, card.giftAmount),"Sending to recipient after cancel gift failed");
      }
        else{
            msg.sender.transfer(card.giftAmount);
        }
    }

    // send nft to buyer
    // super.safeTransferFrom(address(this), msg.sender, tokenId);

    // log cancel event
    emit LogCancel(_ephemeralAddress, msg.sender, tokenId);

    return true;
  }


  /**
   * @dev Claim gift to receiver's address if it is correctly signed
   * with private key for verification public key assigned to gift.
   *
   * @param _receiver address Signed address.
   * @return True if success.
   */
  function claimGift(address _receiver) public returns (bool success) {
    // only holder of ephemeral private key can claim gift
    address _ephemeralAddress = msg.sender;

    uint256 tokenId = ephemeralWalletCards[_ephemeralAddress];

    require(tokenId != 0, "The calling address does not have an ephemeral account associated with it");

    RadiCard storage card = tokenIdToRadiCardIndex[tokenId];

    // is deposited and wasn't claimed or cancelled before
    require(card.status == Statuses.Deposited, "Can only claim a gift that is unclaimed");

    // update gift status to claimed
    card.status = Statuses.Claimed;

    // send nft to receiver
    super.safeTransferFrom(address(this), _receiver, tokenId);

    // transfer optional ether & dai to receiver's address
    if (card.giftAmount > 0) {
        if(card.daiDonation){
            require(daiContract.transfer(_receiver, card.giftAmount),"Sending to recipient after cancel gift failed");
      }
        else{
            // _receiver.transfer(card.giftAmount);
        }
    }

    // log claim event
    emit LogClaim(
        _ephemeralAddress,
        card.gifter,
        tokenId,
        _receiver,
        card.giftAmount,
        card.daiDonation
    );
    return true;
  }


  function burn(uint256 _tokenId) public pure  {
    revert("Radi.Cards are censorship resistant!");
  }

  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));

    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
  }

  function tokenDetails(uint256 _tokenId)
  public view
  returns (
    address _gifter,
    string _message,
    bool _daiDonation,
    uint256 _giftAmount,
    uint256 _donationAmount,
    Statuses status,
    uint256 _cardIndex,
    uint256 _benefactorIndex
  ) {
    require(exists(_tokenId));
    RadiCard memory _radiCard = tokenIdToRadiCardIndex[_tokenId];
    return (
      _radiCard.gifter,
      _radiCard.message,
      _radiCard.daiDonation,
      _radiCard.giftAmount,
      _radiCard.donationAmount,
      _radiCard.status,
      _radiCard.cardIndex,
      _radiCard.benefactorIndex
    );
  }

  function tokenBenefactor(uint256 _tokenId)
  public view
  returns (
    address _ethAddress,
    string _name,
    string _website,
    string _logo
  ) {
    require(exists(_tokenId));
    RadiCard memory _radiCard = tokenIdToRadiCardIndex[_tokenId];
    Benefactor memory _benefactor = benefactors[_radiCard.benefactorIndex];
    return (
      _benefactor.ethAddress,
      _benefactor.name,
      _benefactor.website,
      _benefactor.logo
    );
  }

  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
  }

  function benefactorsKeys() public view returns (uint256[] _keys) {
    return benefactorsIndex;
  }

  function cardsKeys() public view returns (uint256[] _keys) {
    return cardsIndex;
  }

  function addBenefactor(uint256 _benefactorIndex, address _ethAddress, string _name, string _website, string _logo)
  public onlyIfWhitelisted(msg.sender)
  returns (bool) {
    require(address(_ethAddress) != address(0), "Invalid address");
    require(bytes(_name).length != 0, "Invalid name");
    require(bytes(_website).length != 0, "Invalid name");
    require(bytes(_logo).length != 0, "Invalid name");

    benefactors[_benefactorIndex] = Benefactor(
      _ethAddress,
      _name,
      _website,
      _logo
    );
    benefactorsIndex.push(_benefactorIndex);

    emit BenefactorAdded(_benefactorIndex);
    return true;
  }

  function addCard(uint256 _cardIndex, string _tokenURI, bool _active, uint256 _maxQnty, uint256 _minPrice)
  public onlyIfWhitelisted(msg.sender)
  returns (bool) {
    require(bytes(_tokenURI).length != 0, "Invalid token URI");

    cards[_cardIndex] = CardDesign(
      _tokenURI,
      _active,
      0,
      _maxQnty,
      _minPrice
    );
    cardsIndex.push(_cardIndex);

    emit CardAdded(_cardIndex);
    return true;
  }

  function setTokenBaseURI(string _newBaseURI) external onlyIfWhitelisted(msg.sender) {
    require(bytes(_newBaseURI).length != 0, "Base URI invalid");

    tokenBaseURI = _newBaseURI;
  }

  function setActive(uint256 _cardIndex, bool _active) external onlyIfWhitelisted(msg.sender) {
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    cards[_cardIndex].active = _active;
  }

  function setMaxQuantity(uint256 _cardIndex, uint256 _maxQnty) external onlyIfWhitelisted(msg.sender) {
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].minted<=_maxQnty, "Cant set the max quantity less than the current total minted");
    cards[_cardIndex].maxQnty = _maxQnty;
  }

  function setMinPrice(uint256 _cardIndex, uint256 _minPrice) external onlyIfWhitelisted(msg.sender) {
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    cards[_cardIndex].minPrice = _minPrice;
  }

  function setDaiContractAddress(address _daiERC20ContractAddress) external onlyIfWhitelisted(msg.sender){
    require(_daiERC20ContractAddress != address(0));
    daiContract = StandardToken(_daiERC20ContractAddress);
  }

  function setMedianizerContractAddress(address _MedianizerContractAddress) external onlyIfWhitelisted(msg.sender){
    require(_MedianizerContractAddress != address(0));
    medianizerContract = Medianizer(_MedianizerContractAddress);
  }

  // returns the current ether price in usd. 18 decimal point precision used
  function getEtherPrice() public view returns(uint256){
    return uint256(medianizerContract.read());
  }

  //returns the value of ether in atto  (1 usd of ether = 10^18 atto)
  function getEthUsdValue(uint256 _ether) public view returns(uint256){
    return ((_ether*getEtherPrice())/(1 ether));
  }

  //returns the minimum required in wei for a particular card given the card min price in dai
  function getMinCardPriceInWei(uint256 _cardIndex) public view returns(uint256){
    return ((cards[_cardIndex].minPrice*1 ether)/getEtherPrice());
  }
}
