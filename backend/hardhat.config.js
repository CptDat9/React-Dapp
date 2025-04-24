require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, 
      },
    },
  },
  paths: {
    artifacts: "./artifacts",
    sources: "./contracts",
    cache: "./cache",
    tests: "./test",
  },
  networks: {
    bscTestnet: {
      url: process.env.BSC_TESTNET,          
      accounts: [process.env.OWNER_PRIV_KEY],
    },
    sapphire: {
      url: process.env.SAPPHIRE_TESTNET,
      accounts: [process.env.OWNER_PRIV_KEY],
      chainId: 23295,
    },
  },
};
