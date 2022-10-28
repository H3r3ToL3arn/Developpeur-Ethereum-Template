require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-web3");
require('hardhat-watcher');



/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    defaultNetwork: "hardhat",
    networks: {
      hardhat: {
      },
      rinkeby: {
        url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde",
         accounts: {
          mnemonic: "",
          path: "m/44'/60'/0'/0",
          initialIndex: 0,
          count: 20,
          passphrase: "",
        },
      },
    },
  solidity: "0.8.17",
  gasReporter: {
    currency: 'ETH',
    gasPrice: 1,
    enabled: (process.env.REPORT_GAS) ? true : false
  },
  watcher: {
    coverage: {
      tasks: ['coverage'],
      files: ['./contracts','./test'],
      verbose: true,
      clearOnStart: true,
    },
  },
};
