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

  //Li Tong
  await contract.addCard(13, "Qmd8kXknAwRqtrnmCmQ34B9ivpqh1XLtFMiECNqZC84HGJ", true, 1, '15000000000000000000', {
    from: account
  });
  //Li Tong
  await contract.addCard(14, "QmPazBaNXT5d2F4BDgQ9KFqy1pDZLrAwDd3RsPCobu1LB9", true, 1, '15000000000000000000', {
    from: account
  });
  //Li Tong
  await contract.addCard(15, "QmQMXneJH5sUHdCeSsPDzUX9Er6pMjZWoj9hgLCXmTpJZM", true, 1, '30000000000000000000', {
    from: account
  });
  //Li Tong
  await contract.addCard(16, "QmQBgBYJv4ABB2fGUq1wxEiyjnGZ8W1uRh7DepHn8jsd4F", true, 1, '30000000000000000000', {
    from: account
  });
  //Li Tong
  await contract.addCard(17, "Qmd5jKDvYbLXHk2sAWHpwA5d86nTrdKneNNCUoJ1LNpV5A", true, 1, '15000000000000000000', {
    from: account
  });
  //Li Tong
  await contract.addCard(18, "QmX9TXhxqgg4hCXx3W53qUVyZMXt27oxAYZmWF8dBz8Za3", true, 1, '30000000000000000000', {
    from: account
  });
  //Meytal Ben-Tzvi	Color Splash
  await contract.addCard(19, "QmauEd3dgvFYsGqHARdSN2AgRr3qNRDuaTZ6m45RkuYhGN", true, 0, '0', {
    from: account
  });
  //Meytal Ben-Tzvi	Ether Glasses
  await contract.addCard(20, "QmYhJmzS1DmapXuaRM8JBfCKXE2K8JH9MLBdVJFPUPrfAW", true, 0, '0', {
    from: account
  });
  //Aktiv Protesk	Pinki.B
  await contract.addCard(21, "QmSCk4jQDrfEMbdaw4kDPKGkCQJTAQd9vhxBtkcA7kJcu1", true, 0, '0', {
    from: account
  });
  //Aktiv Protesk	Pinki.B
  await contract.addCard(22, "QmXQCBxTS74TrSFa6tJTfqosWKEbd8EFaxWewMqzg11jWv", true, 0, '0', {
    from: account
  });
  //Aktiv Protesk	Pinki.B
  await contract.addCard(23, "QmSYj3hYHiH5Jbj4PuihGdhFiUwnTv7GJW5AgCoWsXAtVr", true, 0, '0', {
    from: account
  });
  // Li Tong	Nervos New Year
  await contract.addCard(24, "QmRYBFY2FRdKfjENnVgQToS8MuvXqHLx87tysK3rdwGZC5", true, 0, '0', {
    from: account
  });
  //Na	imToken wishes a Happy New Year #1
  await contract.addCard(25, "QmZLyV6JgrNyyRnvuFq3p6K3UCtg6eQmHgvwuEkkrKaM6E", true, 3, '10000000000000000000', {
    from: account
  });
  //Na	imToken wishes a Happy New Year #2
  await contract.addCard(26, "QmbxsRY8GLQ712U4xuoqZebiGtiiTf5fF5CA175i94X3ik", true, 3, '30000000000000000000', {
    from: account
  });
  //Na	imToken wishes a Happy New Year #3
  await contract.addCard(27, "QmQUz75ndvouEeMAfSErNF2LTRSPqCiuBwNuFUEKtKEQ24", true, 0, '0', {
    from: account
  });
  //Ophelia Fu	Piggy New Year
  await contract.addCard(28, "QmVXJJ4M8oGaz3KD7qgVY5ft92cNeBcVxkCqrr31rMJTfK", true, 0, '0', {
    from: account
  });
};
