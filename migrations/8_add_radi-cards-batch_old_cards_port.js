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
  await contract.addCard(
    29,
    "QmQdNgFnmfKnWjYF6bvfH67f2rLLa74eTBQLWzozfdKfmo",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // FU -stars
  await contract.addCard(
    30,
    "QmP8USgWUrihWfyhy7CNakcDbtkVPfJYKuZd9hcikP26QD",
    true,
    30,
    "2000000000000000000",
    {
      from: account
    }
  ); // Stina - bird
  await contract.addCard(
    31,
    "QmTT82fZU1TTfcEWfiLP4HNbjGbsHJFh2uNwjUsveAYfnS",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // hex - xstars

  await contract.addCard(
    32,
    "QmTpGkY8hKS5bUMcVqYSaW82apqaXutdiBUN7N1BsduXE2",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // catz on eth
  await contract.addCard(
    33,
    "QmbYP1ywoeHPLWzG8iwL6tRdxBZiZhrLKf1eCCudfiwiVH",
    true,
    0,
    0,
    {
      from: account
    }
  ); // uly18
  await contract.addCard(
    34,
    "QmReorweLZz3fmRwrgULLmUS68ULpEZZVe3tc8km6QxEoG",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // church
  await contract.addCard(
    35,
    "QmbQui9FuborNrTvJ64viYxofPTC1MV6Sz1aeEqoFpFbZ4",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // piracy
  await contract.addCard(
    36,
    "QmYGTybj7oxLSuHajTDgusEsVGXVDXtdBCcEqwr39NmAsr",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // free cat


  await contract.addCard(
    37,
    "QmSoUaxVvT6AEdhnVyVxxPvFNW9EqNZbn3Us397pBb8z8v",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // aktiv
  await contract.addCard(
    38,
    "QmTNjtQNEwximQy4Gz8unvyuP54sd9ZEk7KzUWJWStgSea",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // lilli
  await contract.addCard(
    39,
    "QmZhWBiZobVPS2426MqAEoMpwuYEysEEgTYoeRdqhZ5U8w",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Code is speech - Hugh D'Andrade
  await contract.addCard(
    40,
    "QmbrNToFNXm7DHpCSrN1uuKEGQFythAPwXW4YdFUDGSdot",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Dice for Strong Passwords - Hugh D'Andrade
  await contract.addCard(
    41,
    "QmbrGdCbNu7cPorMJ65hBi3zsxsYgPLF9v9jvewmUJHWwC",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Sovereign Keys - Hugh D'Andrade
  await contract.addCard(
    42,
    "QmXdkz2PhSTBqGbQhFMnMPQfzDm8matUCCEHPUmhnb93bW",
    true,
    0,
    0,
    {
      from: account
    }
  ); // Buidl hard or go home - Hernan Wave
  await contract.addCard(
    43,
    "Qmbm4rtaJYhGBZ2qJYw8hUyG29TEXGraHWvMDGpAmxpbUn",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Greetings from Centrifuge - Stas Leontyev
  await contract.addCard(
    44,
    "QmXufxuozgyscvdQgQNg75RyDK7fgn6RmcCdFamLyRVecV",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // MERRY txMAS - laazeecat
  await contract.addCard(
    45,
    "QmcZJT7eb74nBDJpDBWdHVBaNvg2ANKgMGUwVmG3cSaBtF",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Rudolf the Red-Node Reindeer - Colony
  await contract.addCard(
    46,
    "QmYQuZ8V18r8EJmokSuShVhSRTak4fuQcdRXQKRnSddP7E",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // A Very Vitalik Xmas - Colony
  await contract.addCard(
    47,
    "QmUupXjyvT1K4ic4VTsRh4uRp1D9u9VZvzFTRVShU2SBTW",
    true,
    20,
    "30000000000000000000",
    {
      from: account
    }
  ); // Solstice - Oficinas TK
  await contract.addCard(
    48,
    "QmXXjCo4Pas5euHLELaiGGy3x1En8vPw1kenjjrdMBGtgY",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // mattyb - The Disillusioned One
  await contract.addCard(
    49,
    "QmQUPbjkKhFH4sst9ujGsKLcfCshEX1ZgCNxFsVd9rVEVV",
    true,
    0,
    0,
    {
      from: account
    }
  ); // mattyb - ETH-LAD
  await contract.addCard(
    50,
    "QmSGVcVWDfc9k9YYxH3ApCWhtWr1g5kyUbmDoddg8TCXu6",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // mattyb - 1P-ETH-LAD
  await contract.addCard(
    51,
    "QmfPhYmnaRER13t9Sb2S17FvGgBSmAG3Z7myqcrjZUGoen",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Astro Ledger - Happy Mew Year
  await contract.addCard(
    52,
    "QmeB9nZrorTysmVx9J6SEB1xaxtRCYBSFZydc8YDVxikTK",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Preston Attebery - Transamerican Gold
  await contract.addCard(
    53,
    "QmXH4cvW8APCosPY3sCAHmqu6CfxZ5jLdvSnNykwhBNSYm",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // ULY128 - Sam & Sara 02
  await contract.addCard(
    54,
    "QmbzDQ6KSEzrBvtzsk6ks6UcUrXRJT5cqGYutNFU5oLk6s",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // uly128 - Tao
  await contract.addCard(
    55,
    "QmQQeCUvBJZeDu2XP2gosZqQSnu95bKuZmHcbbd7gHuDy7",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // Aktiv Protesk	- Pix-Mas Claus
  await contract.addCard(
    56,
    "QmWrwpjFiL93jxVtJbQzQ791bVatkKJsMEWPhr8yvXsAoQ",
    true,
    0,
    "2000000000000000000",
    {
      from: account
    }
  ); // BlockPunk	- Oedo Chanko

  await contract.addCard(
    57,
    "QmQr3w9ZvsuvcWNqa2qEzaMFYv8DY2zJQXg7x5wMNPiBVV",
    true,
    10,
    "10000000000000000000",
    {
      from: account
    }
  ); // tda	- The Genesis

  await contract.addCard(
    58,
    "QmZs9nYuhZMQGqY2ujWdrgy2QQAaWPCrTw2aBe4V5yozwE",
    true,
    50,
    "20000000000000000000",
    {
      from: account
    }
  ); // tda - ConstantinoplEth
};
