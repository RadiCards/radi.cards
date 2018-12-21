const RadiCards = artifacts.require("./RadiCards.sol");

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = '4ed01157025d44b0b0ad5932e1d877ea';

module.exports = async (deployer, network, accounts) => {

  let account = accounts[0];

  // Load in other accounts for different networks
  if (network === 'ropsten' || network === 'ropsten-fork' || network === 'rinkeby' || network === 'rinkeby-fork') {
    account = new HDWalletProvider(require('../mnemonic'), `https://${network}.infura.io/v3/${infuraApikey}`, 0).getAddress();
  }

  if (network === 'live' || network === 'live-fork') {
    account = new HDWalletProvider(require('../mnemonic_live'), `https://mainnet.infura.io/v3/${infuraApikey}`, 0).getAddress();
  }

  console.log(`Running within network = ${network}`);
  console.log(`Account = ${account}`);

  const contract = await RadiCards.deployed();
  await contract.addCard(22, "QmXXjCo4Pas5euHLELaiGGy3x1En8vPw1kenjjrdMBGtgY", true, {from: account}); // mattyb - The Disillusioned One
  await contract.addCard(23, "QmQUPbjkKhFH4sst9ujGsKLcfCshEX1ZgCNxFsVd9rVEVV", true, {from: account}); // mattyb - ETH-LAD
  await contract.addCard(24, "QmSGVcVWDfc9k9YYxH3ApCWhtWr1g5kyUbmDoddg8TCXu6", true, {from: account}); // mattyb - 1P-ETH-LAD
  await contract.addCard(25, "QmfPhYmnaRER13t9Sb2S17FvGgBSmAG3Z7myqcrjZUGoen", true, {from: account}); // Astro Ledger - Happy Mew Year
  await contract.addCard(26, "QmeB9nZrorTysmVx9J6SEB1xaxtRCYBSFZydc8YDVxikTK", true, {from: account}); // Preston Attebery - Transamerican Gold
  await contract.addCard(27, "QmXH4cvW8APCosPY3sCAHmqu6CfxZ5jLdvSnNykwhBNSYm", true, {from: account}); // ULY128 - Sam & Sara 02
  await contract.addCard(28, "QmbzDQ6KSEzrBvtzsk6ks6UcUrXRJT5cqGYutNFU5oLk6s", true, {from: account}); // uly128 - Tao
  await contract.addCard(29, "QmQQeCUvBJZeDu2XP2gosZqQSnu95bKuZmHcbbd7gHuDy7", true, {from: account}); // Aktiv Protesk	- Pix-Mas Claus
  await contract.addCard(30, "QmWrwpjFiL93jxVtJbQzQ791bVatkKJsMEWPhr8yvXsAoQ", true, {from: account}); // BlockPunk	- Oedo Chanko
};
