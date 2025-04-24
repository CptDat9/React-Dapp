const { ethers } = require("ethers");

const removeLiquidity = async () => {
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545");
    const privateKey = "314f8194ded19014585e30ac35b386041f7171892e30a869d3baf5f4ecdf80a6";
  const signer = new ethers.Wallet(privateKey, provider);

  const routerAddress = "0xb9E1E704d284BbcedDebe1DD13d396B78A815Ac8"; 
  const ETH_ADDRESS = "0x517D553C7Bda6860E13fcC07cd9396F45eC14462"; 
  const USDT_ADDRESS = "0x7a9c21537BF058F4b01213f46a84b9F72e310D9B"; 
  const LP_TOKEN_ADDRESS = "0xCe1F49ea6cD6730507031cc8796bE70EdEC79c2e"; 

  const routerABI = [
    {
      "inputs": [
        { "internalType": "address", "name": "tokenA", "type": "address" },
        { "internalType": "address", "name": "tokenB", "type": "address" },
        { "internalType": "uint256", "name": "liquidity", "type": "uint256" },
        { "internalType": "uint256", "name": "amountAMin", "type": "uint256" },
        { "internalType": "uint256", "name": "amountBMin", "type": "uint256" },
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "deadline", "type": "uint256" }
      ],
      "name": "removeLiquidity",
      "outputs": [
        { "internalType": "uint256", "name": "amountA", "type": "uint256" },
        { "internalType": "uint256", "name": "amountB", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  const lpTokenABI = [
    {
      "constant": true,
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }],
      "name": "allowance",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        { "internalType": "address", "name": "spender", "type": "address" },
        { "internalType": "uint256", "name": "amount", "type": "uint256" }
      ],
      "name": "approve",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const routerContract = new ethers.Contract(routerAddress, routerABI, signer);
  const lpTokenContract = new ethers.Contract(LP_TOKEN_ADDRESS, lpTokenABI, signer);
  const liquidityAmount = ethers.parseUnits("0.000001", 18);

  const deadline = Math.floor(Date.now() / 1000) + 600; 

  console.log('Check Balance pass: 1/3');

  const lpBalance = await lpTokenContract.balanceOf(signer.address);
  if (lpBalance < liquidityAmount) {
    throw new Error("ko du LP token balance");
  }
  const lpAllowance = await lpTokenContract.allowance(signer.address, routerAddress);
  if (lpAllowance < liquidityAmount) {
    if (lpAllowance > 0) await lpTokenContract.approve(routerAddress, 0); 
    await lpTokenContract.approve(routerAddress, ethers.MaxUint256); 
    console.log('Approved LP pass: 1/3');
  }

  console.log('Removing liquid:  2/3');
  try {
    const tx = await routerContract.removeLiquidity(
      ETH_ADDRESS,
      USDT_ADDRESS,
      liquidityAmount,
      0,
      0,
      signer.address,
      deadline,
      { gasLimit: 500000 } // Gas
    );
    await tx.wait();
    console.log('Liquidity removed successfully! :   3/3');
  } catch (error) {
    console.error("Error removing liquidity:", error.message);
    console.error("Reason:", error.reason || "No reason provided.");
    console.error("Data:", error.data || "No additional data.");
  }
};

removeLiquidity().catch((error) => {
  console.error("Error:", error.message);
});
