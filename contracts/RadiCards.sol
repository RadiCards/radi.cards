pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

import "./Strings.sol";

/**
* @title Radi.Cards
*
* @author blockrocket.tech (smart contracts)
* @author cryptodecks.co
* @author knownorigin.io
* @author pheme.app
* @author d1labs.com
* @author mbdoesthings.com
* @author chrismaree.io
*/
contract RadiCards is ERC721Token, Whitelist {
  using SafeMath for uint256;

  StandardToken daiContract;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public tokenIdPointer = 0;
  uint256 public minContribution = 0.01 ether;

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

  struct RadiCard {
    // Metadata
    address creator;
    string message;
    bool daiDonation;
    uint256 giftingAmount;
    uint256 donatingAmount;
    // Lookups
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
    uint256 _tokenId
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
  
  function gift(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, uint256 _donationAmount) payable public returns (bool) {
    require(to != address(0), "Must be a valid address");
    require(benefactors[_benefactorIndex].ethAddress != address(0), "Must specify existing benefactor");
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].active, "Must be an active card");
    require(_donationAmount <= msg.value,"Can't request to donate more than total value sent");
    require(msg.value >= minContribution, "Must send at least the minimum amount");
    
    if (cards[_cardIndex].maxQnty > 0){ //the max quantity is set to zero to indicate no limit. Only need to check that can mint if limited
      require(cards[_cardIndex].minted < cards[_cardIndex].maxQnty, "Can't exceed maximum quantity of card type");
    }

    uint256 _giftAmount = msg.value - _donationAmount;

    tokenIdToRadiCardIndex[tokenIdPointer] = RadiCard({
        creator : msg.sender,
        daiDonation: false,
        giftingAmount : _giftAmount,
        donatingAmount: _donationAmount,
        message : _message,
        benefactorIndex : _benefactorIndex,
        cardIndex : _cardIndex
    });

    uint256 _tokenId = _mint(to, cards[_cardIndex].tokenURI);

    cards[_cardIndex].minted++;

    // transfer the ETH to the benefactor and recipaint
    if(_donationAmount > 0){
      benefactors[_benefactorIndex].ethAddress.transfer(_donationAmount);
    }
    
    if(_giftAmount > 0){
        to.transfer(_giftAmount);
    }
    
    // tally up the total eth gifted and donated
    totalGiftedInWei = totalGiftedInWei.add(_giftAmount);
    totalDonatedInWei = totalDonatedInWei.add(_donationAmount);

    emit CardGifted(to, _benefactorIndex, _cardIndex, msg.sender, _tokenId);

    return true;
  }

  function giftInDai(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, uint256 _donationAmount, uint256 _giftAmount) public returns (bool) {
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

    tokenIdToRadiCardIndex[tokenIdPointer] = RadiCard({
        creator : msg.sender,
        daiDonation: true,
        giftingAmount : _giftAmount,
        donatingAmount: _donationAmount,
        message : _message,
        benefactorIndex : _benefactorIndex,
        cardIndex : _cardIndex
    });

    uint256 _tokenId = _mint(to, cards[_cardIndex].tokenURI);

    cards[_cardIndex].minted++;

    // transfer the DAI to the benefactor and recipaint
    if(_donationAmount > 0){
        address _benefactorAddress = benefactors[_benefactorIndex].ethAddress;
        require(daiContract.transferFrom(msg.sender, _benefactorAddress, _donationAmount),"Sending to charity failed");
    }
    
    if(_giftAmount > 0){
        require(daiContract.transferFrom(msg.sender, to, _giftAmount),"Sending to recipaint failed");
    }
    
    // tally up the total eth gifted and donated
    totalGiftedInAtto = totalGiftedInAtto.add(_giftAmount);
    totalDonatedInAtto = totalDonatedInAtto.add(_donationAmount);

    emit CardGifted(to, _benefactorIndex, _cardIndex, msg.sender, _tokenId);

    return true;

  }


  function _mint(address to, string tokenURI) internal returns (uint256 _tokenId) {
    uint256 tokenId = tokenIdPointer;

    super._mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

    tokenIdPointer = tokenIdPointer.add(1);

    return tokenId;
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
    address _creator,
    bool _daiDonation,
    uint256 _giftingAmount,
    uint256 _donatingAmount,
    string _message,
    uint256 _cardIndex,
    uint256 _benefactorIndex
  ) {
    require(exists(_tokenId));
    RadiCard memory _radiCard = tokenIdToRadiCardIndex[_tokenId];
    return (
      _radiCard.creator,
      _radiCard.daiDonation,
      _radiCard.giftingAmount,
      _radiCard.donatingAmount,
      _radiCard.message,
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

  function setMinContribution(uint256 _minContribution) external onlyIfWhitelisted(msg.sender) {
    require(_minContribution > 0, "Invalid minimum contribution");

    minContribution = _minContribution;
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

  function setDaiContractAddress(address _daiERC20ContractAddress) external onlyIfWhitelisted(msg.sender){
    require(_daiERC20ContractAddress != address(0));
    daiContract = StandardToken(_daiERC20ContractAddress);
  }
}
