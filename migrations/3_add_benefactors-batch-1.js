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

  await contract.addBenefactor(
    1,
    "0xb189f76323678E094D4996d182A792E52369c005",
    "Electronic Frontier Foundation",
    "https://www.eff.org/pages/ethereum-and-litecoin-donations",
    "https://ipfs.infura.io/ipfs/QmY9ECy55kWevPJQ2RDYJxDmB16h5J8SfhEyuEUAUnAyGU",
    {from: account});

  await contract.addBenefactor(
    2,
    "0x904f56d3c5D0C622f7f27D374ED7A07c5dEe887D",
    "EnLAW Foundation",
    "https://enlawfoundation.org",
    "https://ipfs.infura.io/ipfs/QmaQkbvPMxVyNto6JBqqK7YPN9Lk3kgjTqcXYbNS7jCLfS",
    {from: account});

  await contract.addBenefactor(
    3,
    "0x59459B87c29167733818f1263665064Cadf10eE4",
    "Open Money Initiative",
    "https://www.openmoneyinitiative.org/",
    "https://ipfs.infura.io/ipfs/Qmc8oRTHBLRNif4b6F9S5KxmZF7AoPaQrQgBeBudTsXUAC",
    {from: account});
};
