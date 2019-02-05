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
    13,
    "QmZhWBiZobVPS2426MqAEoMpwuYEysEEgTYoeRdqhZ5U8w",
    true,
    { from: account }
  ); // Code is speech - Hugh D'Andrade
  await contract.addCard(
    14,
    "QmbrNToFNXm7DHpCSrN1uuKEGQFythAPwXW4YdFUDGSdot",
    true,
    { from: account }
  ); // Dice for Strong Passwords - Hugh D'Andrade
  await contract.addCard(
    15,
    "QmbrGdCbNu7cPorMJ65hBi3zsxsYgPLF9v9jvewmUJHWwC",
    true,
    { from: account }
  ); // Sovereign Keys - Hugh D'Andrade
  await contract.addCard(
    16,
    "QmXdkz2PhSTBqGbQhFMnMPQfzDm8matUCCEHPUmhnb93bW",
    true,
    { from: account }
  ); // Buidl hard or go home - Hernan Wave
  await contract.addCard(
    17,
    "Qmbm4rtaJYhGBZ2qJYw8hUyG29TEXGraHWvMDGpAmxpbUn",
    true,
    { from: account }
  ); // Greetings from Centrifuge - Stas Leontyev
  await contract.addCard(
    18,
    "QmXufxuozgyscvdQgQNg75RyDK7fgn6RmcCdFamLyRVecV",
    true,
    { from: account }
  ); // MERRY txMAS - laazeecat
  await contract.addCard(
    19,
    "QmcZJT7eb74nBDJpDBWdHVBaNvg2ANKgMGUwVmG3cSaBtF",
    true,
    { from: account }
  ); // Rudolf the Red-Node Reindeer - Colony
  await contract.addCard(
    20,
    "QmYQuZ8V18r8EJmokSuShVhSRTak4fuQcdRXQKRnSddP7E",
    true,
    { from: account }
  ); // A Very Vitalik Xmas - Colony
  await contract.addCard(
    21,
    "QmUupXjyvT1K4ic4VTsRh4uRp1D9u9VZvzFTRVShU2SBTW",
    true,
    { from: account }
  ); // Solstice - Oficinas TK
};
