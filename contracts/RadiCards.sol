pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

import "./Strings.sol";

/**
* @title Radi.Cards
*
*
*/
contract RadiCards is ERC721Token, Whitelist {
  using SafeMath for uint256;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  uint256 public tokenIdPointer = 0;
  uint256 public minContribution = 0.05 ether;

  struct Benefactor {
    address ethAddress;
    string name;
    string website;
  }

  struct Card {
    string tokenURI;
    bool active;
  }

  mapping(uint256 => Benefactor) public benefactors;
  uint256[] internal benefactorsIndex;

  mapping(uint256 => Card) public cards;
  uint256[] internal cardsIndex;

  mapping(uint256 => string) public messages;
  mapping(uint256 => string) public extras;

  constructor () public ERC721Token("RadiCards", "RADI") {
    addAddressToWhitelist(msg.sender);

    addBenefactor(
      1,
      address(0xb189f76323678E094D4996d182A792E52369c005),
      "Electronic Frontier Foundation",
      "https://www.eff.org/pages/ethereum-and-litecoin-donations"
    );

    addBenefactor(
      2,
      address(0x998F25Be40241CA5D8F5fCaF3591B5ED06EF3Be7),
      "Freedom of the Press Foundation",
      "https://freedom.press/donate/cryptocurrency/"
    );
  }

  function gift(address to, uint256 _benefactorIndex, uint256 _cardIndex, string _message, string _extra) payable public returns (bool) {
    require(benefactors[_benefactorIndex].ethAddress != address(0), "Must specify existing benefactor");
    require(bytes(cards[_cardIndex].tokenURI).length != 0, "Must specify existing card");
    require(cards[_cardIndex].active, "Must be an active card");

    require(msg.value >= minContribution, "Must send at least the minimum amount");

    messages[tokenIdPointer] = _message;
    extras[tokenIdPointer] = _extra;

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
    messages[_tokenId] = "";
    extras[_tokenId] = "";

    // Super burn
    _burn(ownerOf(_tokenId), _tokenId);
  }

  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));

    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
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

  function addBenefactor(uint256 _benefactorIndex, address _ethAddress, string _name, string _website) public onlyIfWhitelisted(msg.sender) {
    require(address(_ethAddress) != address(0), "Invalid address");
    require(bytes(_name).length != 0, "Invalid name");
    require(bytes(_website).length != 0, "Invalid name");

    benefactors[_benefactorIndex] = Benefactor(
      _ethAddress,
      _name,
      _website
    );
    benefactorsIndex.push(_benefactorIndex);
  }

  function addCard(uint256 _cardIndex, string _tokenURI, bool _active) public onlyIfWhitelisted(msg.sender) {
    require(bytes(_tokenURI).length != 0, "Invalid token URI");

    cards[_cardIndex] = Card(
      _tokenURI,
      _active
    );
    cardsIndex.push(_cardIndex);
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
