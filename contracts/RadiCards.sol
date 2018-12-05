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

  // A pointer to the next token to be minted, zero indexed
  uint256 public tokenIdPointer = 0;

  uint256 public minContribution = 0.05 ether;

  struct Benefactor {
    address ethAddress;
    string name;
    string website;
  }

  struct Card {
    string ipfs;
    string name;
    string description;
  }

  mapping(uint256 => Benefactor) public benefactors;
  uint256[] internal benefactorsIndex;

  mapping(uint256 => Card) public cards;
  uint256[] internal cardsIndex;

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

    addCard(
      1,
      "QmUyLttKRZxneFmmoETXoVfy3X1dmoimQ2PFLrSNM5EDMR",
      "Grinch",
      "Green fella"
    );

    addCard(
      2,
      "QmSD3wWx4tSXsCaDrKMVHU8aGhXzbruLw1jLm4PBUXLdT3",
      "Skull",
      "Santa's head!"
    );
  }

  function gift(address to, string tokenURI, uint256 _benefactor) payable public returns (bool) {
    require(msg.value >= minContribution, "Must send at least the minimum amount");
    require(benefactors[_benefactor].ethAddress != address(0), "Must specify existing benefactor");

    _mint(to, tokenURI);

    benefactors[_benefactor].ethAddress.transfer(msg.value);

    return true;
  }

  function _mint(address to, string tokenURI) internal {
    uint256 tokenId = tokenIdPointer;

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

    tokenIdPointer = tokenIdPointer.add(1);
  }

  function burn(uint256 tokenId) public onlyIfWhitelisted(msg.sender) {
    // Super burn
    _burn(ownerOf(tokenId), tokenId);
  }

  function setTokenBaseURI(string _newBaseURI) external onlyIfWhitelisted(msg.sender) {
    require(bytes(_newBaseURI).length != 0, "Base URI invalid");
    tokenBaseURI = _newBaseURI;
  }

  function setMinContribution(uint256 _minContribution) external onlyIfWhitelisted(msg.sender) {
    minContribution = _minContribution;
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

  function addBenefactor(uint256 _index, address _ethAddress, string _name, string _website) public onlyIfWhitelisted(msg.sender) {
    benefactors[_index] = Benefactor(
      _ethAddress,
      _name,
      _website
    );
    benefactorsIndex.push(_index);
  }

  function addCard(uint256 _index, string _ipfs, string _name, string _description) public onlyIfWhitelisted(msg.sender) {
    cards[_index] = Card(
      _ipfs,
      _name,
      _description
    );
    cardsIndex.push(_index);
  }
}
