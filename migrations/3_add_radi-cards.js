const RadiCards = artifacts.require("./RadiCards.sol");

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraApikey = '4396873c00c84479991e58a34a54ebd9';

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
  await contract.addCard(1, "QmQW8sa7KrpZuTD2TzvjsHLXjeAASiN7kE8ry5sCLYwMTy", true);
  await contract.addCard(2, "QmZP4jyXX5opusczig8C91jKw2NNZbNsxdSuyj7wVh46H5", true);
  await contract.addCard(3, "QmTA7EmrK5b7q4drzEXzLYHwVJToYmjohUeSf57ryB5PF7", true);
  await contract.addCard(4, "QmUBVvkPQodEr4JSdKtp2PGGDZsVCUekr251CxLF2q2Gb2", true);
};
