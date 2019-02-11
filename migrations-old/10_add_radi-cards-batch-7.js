const RadiCards = artifacts.require("./RadiCards.sol");

const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraApikey = "4ed01157025d44b0b0ad5932e1d877ea";

module.exports = async (deployer, network, accounts) => {
  let account = accounts[0];

  // Load in other accounts for different networks
  if (
    network === "ropsten" ||
    network === "ropsten-fork" ||
    network === "rinkeby" ||
    network === "rinkeby-fork" ||
    network === "kovan" ||
    network === "kovan-fork"
  ) {
    account = new HDWalletProvider(
      require("../mnemonic"),
      `https://${network}.infura.io/v3/${infuraApikey}`,
      0
    ).getAddress();
  }

  if (network === "live" || network === "live-fork") {
    account = new HDWalletProvider(
      require("../mnemonic_live"),
      `https://mainnet.infura.io/v3/${infuraApikey}`,
      0
    ).getAddress();
  }

  console.log(`Running within network = ${network}`);
  console.log(`Account = ${account}`);

  const contract = await RadiCards.deployed();
  await contract.addCard(
    31,
    "QmQr3w9ZvsuvcWNqa2qEzaMFYv8DY2zJQXg7x5wMNPiBVV",
    true,
    { from: account }
  ); // tda	- The Genesis
};
