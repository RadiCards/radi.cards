const RadiCards = artifacts.require("./RadiCards.sol");

const HDWalletProvider = require("truffle-hdwallet-provider");
const infuraApikey = "9542ce9f96be4ae08225dcde36ff1638";

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
  await contract.addCard(3, "QmZoBtnkDXXiod8CFyrXyun6CTWi826jwHhMhPPqc2Bjp2", true, 0, '1000000000000000000', {from: account}); // Ophelia Fu	- Ink Fireworks
  await contract.addCard(4, "QmcNqjBXr1hwL6xHhigutMKcqACqa9aNysDGWzgN6N3QVr", true, 0, '1000000000000000000', {from: account}); // Pet3rpan - Chinese NoYuan
  await contract.addCard(5, "QmWfXVp37surPRAwSX9bf5MJ2WfiN94mqgcGwJaJoM54m3", true, 0, '1000000000000000000', {from: account}); // Joyful IN PIG YEAR
  await contract.addCard(6, "Qmdwb211MBb2n5BkYF6p6xr7QkPte669kQCiJveQiAtTkb", true, 0, '1000000000000000000', {from: account}); //Aktiv Protesk	- Pinki.B
  await contract.addCard(7, "QmSe6BLCR17kvBh94HuHreWPry5VEzorEpeuGHiCEwCg6M", true, 0, '1000000000000000000', {from: account}); //Aktiv Protesk	- Pinki.B
};
