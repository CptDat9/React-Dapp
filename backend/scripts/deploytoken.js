const { ethers } = require("hardhat"); // Import ethers từ Hardhat

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploy contract with account: " + deployer.address);

    // Deploy ETH token
    const ETH = await ethers.getContractFactory("ETH");
    const eth = await ETH.deploy(ethers.parseEther("1000000"));
    await eth.waitForDeployment(); // Chờ đợi giao dịch triển khai hoàn tất
    console.log("ETH token deployed to:", await eth.getAddress());

    // Deploy USDT token
    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy("1000000000000");
    await usdt.waitForDeployment(); // Chờ đợi giao dịch triển khai hoàn tất
    console.log("USDT token deployed to:", await usdt.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
