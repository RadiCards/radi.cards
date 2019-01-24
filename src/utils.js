const getNetIdString = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return 'Main Ethereum Network';
        case 3:
          return 'Ropsten Ethereum Test Network';
        case 4:
          return 'Rinkeby Ethereum Test Network';
        case 42:
          return 'Kovan Ethereum Test Network';
        case 'loading':
          return 'loading..';
          // Will be some random number when connected locally
        default:
          return 'Local Test Network';
      }
    });
};

const getEtherscanAddress = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return 'https://etherscan.io';
        case 3:
          return 'https://ropsten.etherscan.io';
        case 4:
          return 'https://rinkeby.etherscan.io';
        case 42:
          return 'https://kovan.etherscan.io';
        default:
          return 'http://localhost';
      }
    })
    .then((etherScanAddress) => {
      console.log(`Setting etherscan address as ${etherScanAddress}`);
      return etherScanAddress;
    });
};

const getDaiContractAddress = () => {
  return window.web3.eth.net.getId()
    .then((id) => {
      switch (id) {
        case 1:
          return '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359'; //main Ethereum dai contract
        case 42:
          return '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'; //kovan ethereum test network
        default:
          return null;
      }
    })
    .then((address) => {
      console.log(`Setting dai contract address ${address}`);
      return address;
    });
}


module.exports = {
  getEtherscanAddress,
  getNetIdString,
  getDaiContractAddress
};
