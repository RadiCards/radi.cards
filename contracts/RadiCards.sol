pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/Whitelist.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

import "./Strings.sol";

/**
* @title Radi.Cards
*/
contract RadiCards is ERC721Token, Whitelist {
  using SafeMath for uint256;

  string public tokenBaseURI = "https://ipfs.infura.io/ipfs/";

  // A pointer to the next token to be minted, zero indexed
  uint256 public tokenIdPointer = 0;

  constructor () public ERC721Token("RadiCards", "RADI") {
    addAddressToWhitelist(msg.sender);
  }

  function mint(string tokenURI) public returns (bool) {
    _mint(msg.sender, tokenURI);
    return true;
  }

  function mintTo(address to, string tokenURI) public returns (bool) {
    _mint(to, tokenURI);
    return true;
  }

  function _mint(address to, string tokenURI) internal {
    uint256 tokenId = tokenIdPointer;

    _mint(to, tokenId);
    _setTokenURI(tokenId, tokenURI);

    tokenIdPointer = tokenIdPointer.add(1);
  }

  function burn(uint256 tokenId) public onlyIfWhitelisted(msg.sender) {
    // Cleanup custom data

    // Super burn
    _burn(ownerOf(tokenId), tokenId);
  }

  function setTokenURI(uint256 tokenId, string uri) public onlyIfWhitelisted(msg.sender) {
    _setTokenURI(tokenId, uri);
  }

  function setTokenBaseURI(string _newBaseURI) external onlyIfWhitelisted(msg.sender) {
    require(bytes(_newBaseURI).length != 0, "Base URI invalid");
    tokenBaseURI = _newBaseURI;
  }

  function tokenURI(uint256 _tokenId) public view returns (string) {
    require(exists(_tokenId));
    return Strings.strConcat(tokenBaseURI, tokenURIs[_tokenId]);
  }

  function tokensOf(address _owner) public view returns (uint256[] _tokenIds) {
    return ownedTokens[_owner];
  }
}
