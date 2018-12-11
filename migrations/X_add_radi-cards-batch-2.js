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
  await contract.addCard(3, "QmQdNgFnmfKnWjYF6bvfH67f2rLLa74eTBQLWzozfdKfmo", true);
  await contract.addCard(4, "QmP8USgWUrihWfyhy7CNakcDbtkVPfJYKuZd9hcikP26QD", true);
  await contract.addCard(5, "QmdT2mKTeQwEA8hd33iHxL9UCS8rjXwpFqCpXF5WALt7Pd", true);
  await contract.addCard(6, "QmTT82fZU1TTfcEWfiLP4HNbjGbsHJFh2uNwjUsveAYfnS", true);
};
