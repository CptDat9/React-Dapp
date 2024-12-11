const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const factoryAddress = "0x9A676e781A523b5d0C0e43731313A708CB607508"; // Địa chỉ Factory
    const ETHAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"; // Địa chỉ ETH hoặc WETH token

    // Lấy Contract Factory
    const Router = await ethers.getContractFactory("UniswapV2Router02");

    // Deploy Router contract
    const router = await Router.deploy(factoryAddress, ETHAddress);
    await router.deploymentTransaction().wait(); // Chờ giao dịch hoàn tất

    console.log("UniswapV2Router02 deployed to:", await router.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
