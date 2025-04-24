const path = require("path");
const { ethers } = require("ethers");
const web3 = require("web3");

const UniswapV2Pair = require(path.join(
  __dirname,
  "../artifacts/contracts/core/UniswapV2Pair.sol/UniswapV2Pair.json"
));

const getCodeHash = async () => {
  console.log(
    'UniswapV2Pair bytecode hash (INIT_CODE_HASH):\n%s',
    web3.utils.keccak256(UniswapV2Pair.bytecode).substring(2)
  );
};

getCodeHash();
