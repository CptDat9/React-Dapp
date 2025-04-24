const { ethers } = require("hardhat"); 

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploy contract with account: " + deployer.address);
    const initialSupply = ethers.parseUnits("1000", 18);
    // ETH
    const ETH = await ethers.getContractFactory("ETH");
    const eth = await ETH.deploy(initialSupply);
    await eth.waitForDeployment(); 
    console.log("ETH token deploy to:", await eth.getAddress());
    // USDT
    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy(initialSupply);
    await usdt.waitForDeployment();
    console.log("USDT token deploy to:", await usdt.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
// Mô tả quy trình để có được pool gồm 2 token ETH và USDT của tôi, đã deploy USDT.sol và ETH.sol lên mạng sapphire sau đó tôi sẽ deploy Factory
// rồi deploy router, sau đó tạo cặp qua creatPair gồm 2 địa chỉ ETH và USDT.sol là ok :?