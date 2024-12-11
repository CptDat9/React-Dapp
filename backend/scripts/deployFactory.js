const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy Factory contract
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    const factory = await Factory.deploy(deployer.address); // Set feeToSetter as deployer
    await factory.waitForDeployment();
    console.log(`UniswapV2Factory deployed to: ${factory.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
