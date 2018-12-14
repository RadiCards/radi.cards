const RadiCards = artifacts.require("./RadiCards.sol");

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = '4ed01157025d44b0b0ad5932e1d877ea';

module.exports = async (deployer, network, accounts) => {

  let account = accounts[0];

  // Load in other accounts for different networks
  if (network === 'ropsten' || network === 'ropsten-fork' || network === 'rinkeby' || network === 'rinkeby-fork') {
    account = new HDWalletProvider(require('../mnemonic'), `https://${network}.infura.io/v3/${infuraApikey}`, 0).getAddress();
  }

  if (network === 'live') {
    account = new HDWalletProvider(require('../mnemonic_live'), `https://mainnet.infura.io/v3/${infuraApikey}`, 0).getAddress();
  }

  console.log(`Running within network = ${network}`);
  console.log(`Account = ${account}`);

  const contract = await RadiCards.deployed();
  await contract.addCard(6, "QmTpGkY8hKS5bUMcVqYSaW82apqaXutdiBUN7N1BsduXE2", true, {from: account}); // catz on eth
  await contract.addCard(7, "QmbYP1ywoeHPLWzG8iwL6tRdxBZiZhrLKf1eCCudfiwiVH", true, {from: account}); // uly18
  await contract.addCard(8, "QmReorweLZz3fmRwrgULLmUS68ULpEZZVe3tc8km6QxEoG", true, {from: account}); // church
  await contract.addCard(9, "QmbQui9FuborNrTvJ64viYxofPTC1MV6Sz1aeEqoFpFbZ4", true, {from: account}); // piracy
  await contract.addCard(10, "QmYGTybj7oxLSuHajTDgusEsVGXVDXtdBCcEqwr39NmAsr", true, {from: account}); // free cat
};
