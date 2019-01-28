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
  await contract.addCard(8, "QmRyjQWtMvKDxe8bVM9MkY3wxxNJTtsdGjTJgkzTa9fUTh", true, 200, 0, {from: account}); // Little Cactus	- Small perspective
  await contract.addCard(9, "QmZnvGMv7ZJQBJKTNqCz2G6LKTDfeAyWV24HQrYegySPL9", true, 1, '300000000000000000', {from: account}); //Li Tong - Nervos new year card No.7
  await contract.addCard(10, "QmaVc3KZQsCvebtqLW5L19Di7pwrJ5c1BjDjc9TKMLrZWv", true, 1, '500000000000000000', {from: account});//Li Tong - Nervos new year card No.4
  await contract.addCard(11, "QmPuAu3rT9DKBmUJfvuSnnDAHT3BB7wedHgPtvqn9JcVvQ", true, 1, '200000000000000000', {from: account}); // Li Tong - Nervos new year card No.2
  await contract.addCard(12, "QmNyjzMb3t59beywwt1ZrRRXFVPbvD5Y3AboP2s73X6TaL", true, 0, 0, {from: account}); // 0xbull	Lù

};
