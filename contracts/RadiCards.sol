pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

import "./Strings.sol";

/**
* @title Radi.Cards
*
* @author Andy Gray & James Morgan - KnownOrigin.io
*/
contract RadiCards is ERC721Token, Whitelist {
  using SafeMath for uint256;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public tokenIdPointer = 0;
  uint256 public minContribution = 0.01 ether; // under $1..now

  struct Benefactor {
    address ethAddress;
    string name;
    string website;
    string description;
    string logo;
  }

  struct CardDesign {
    string tokenURI;
    bool active;
  }

  struct RadiCard {
    // Metadata
    address gifter;
    uint256 giftingAmount;
    string message;
    string extra;
    // Lookups
    uint256 cardIndex;
    uint256 benefactorIndex;
  }

  event BenefactorAdded(
    uint256 indexed _benefactorIndex
  );

  event CardAdded(
    uint256 indexed _benefactorIndex
  );

  mapping(uint256 => Benefactor) public benefactors;
  uint256[] internal benefactorsIndex;

  mapping(uint256 => CardDesign) public cards;
  uint256[] internal cardsIndex;

  mapping(uint256 => RadiCard) public tokenIdToRadiCardIndex;

  constructor () public ERC721Token("RadiCards", "RADI") {
    addAddressToWhitelist(msg.sender);

    addBenefactor(
      1,
      address(0xb189f76323678E094D4996d182A792E52369c005),
      "Electronic Frontier Foundation",
      "https://www.eff.org/pages/ethereum-and-litecoin-donations",
      "Electronic Frontier Foundation",
      "https://ipfs.infura.io/ipfs/QmY9ECy55kWevPJQ2RDYJxDmB16h5J8SfhEyuEUAUnAyGU"
    );

    // TODO complete
    addBenefactor(
      2,returns indexes
      address(0x998F25Be40241CA5D8F5fCaF3591B5ED06EF3Be7),
      "Freedom of the Press Foundation",
      "https://freedom.press/donate/cryptocurrency/",
      "Freedom of the Press Foundation",
      "TODO logo"
    );

    addBenefactor(
      3,
      address(0x59459B87c29167733818f1263665064Cadf10eE4),
      "Open Money Initiative",
      "https://www.openmoneyinitiative.org/",
      "Open Money Initiative",
      "https://ipfs.infura.io/ipfs/Qmc8oRTHBLRNif4b6F9S5KxmZF7AoPaQrQgBeBudTsXUAC"
    );

    // TODO complete
//    addBenefactor(
//      4,
//      address(0),
//      "Tor project",
//      "https://www.torproject.org/",
//      "Tor project",
//      "TODO logo"
//    );
  }

  function gift(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, string _extra) payable public returns (bool) {
    require(to != address(0), "Must be a valid address");
    require(benefactors[_benefactorIndex].ethAddress != address(0), "Must specify existing benefactor");
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].active, "Must be an active card");
    require(msg.value >= minContribution, "Must send at least the minimum amount");

    tokenIdToRadiCardIndex[tokenIdPointer] = RadiCard({
      gifter : msg.sender,
      giftingAmount : msg.value,
      message : _message,
      extra : _extra,
      benefactorIndex : _benefactorIndex,
      cardIndex : _cardIndex
    });

    _mint(to, cards[_cardIndex].tokenURI);

    // transfer the ETH to the benefactor
    benefactors[_benefactorIndex].ethAddress.transfer(msg.value);

    return true;
  }

  function _mint(address to, string tokenURI) internal {
    uint256 tokenId = tokenIdPointer;

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

    tokenIdPointer = tokenIdPointer.add(1);
  }

  function burn(uint256 _tokenId) public onlyIfWhitelisted(msg.sender) {
    // custom fields
    delete tokenIdToRadiCardIndex[tokenIdPointer];

    // Super burn
    _burn(ownerOf(_tokenId), _tokenId);
  }

  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));

    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
  }

  function tokenDetails(uint256 _tokenId)
  public view
  returns (
    address _gifter,
    uint256 _giftingAmount,
    string _message,
    string _extra,
    string _tokenUri
  ) {
    require(exists(_tokenId));
    RadiCard memory _radiCard = tokenIdToRadiCardIndex[_tokenId];
    return (
      _radiCard.gifter,
      _radiCard.giftingAmount,
      _radiCard.message,
      _radiCard.extra,
      Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId])
    );
  }

  function tokenBenefactor(uint256 _tokenId)
  public view
  returns (
    address _ethAddress,
    string _name,
    string _website,
    string _description,
    string _logo
  ) {
    require(exists(_tokenId));
    RadiCard memory _radiCard = tokenIdToRadiCardIndex[_tokenId];
    Benefactor memory _benefactor = benefactors[_radiCard.benefactorIndex];
    return (
      _benefactor.ethAddress,
      _benefactor.name,
      _benefactor.website,
      _benefactor.description,
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

  function addBenefactor(uint256 _benefactorIndex, address _ethAddress, string _name, string _website, string _description, string _logo) public onlyIfWhitelisted(msg.sender) {
    require(address(_ethAddress) != address(0), "Invalid address");
    require(bytes(_name).length != 0, "Invalid name");
    require(bytes(_website).length != 0, "Invalid name");
    require(bytes(_description).length != 0, "Invalid name");
    require(bytes(_logo).length != 0, "Invalid name");

    benefactors[_benefactorIndex] = Benefactor(
      _ethAddress,
      _name,
      _website,
      _description,
      _logo
    );
    benefactorsIndex.push(_benefactorIndex);

    emit BenefactorAdded(_benefactorIndex);
  }

  function addCard(uint256 _cardIndex, string _tokenURI, bool _active) public onlyIfWhitelisted(msg.sender) {
    require(bytes(_tokenURI).length != 0, "Invalid token URI");

    cards[_cardIndex] = CardDesign(
      _tokenURI,
      _active
    );
    cardsIndex.push(_cardIndex);

    emit CardAdded(_cardIndex);
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
}
