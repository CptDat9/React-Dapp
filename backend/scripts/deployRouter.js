const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const factoryAddress = "0xA91629c5Dceecd0BC57CDee07E2471218C202384";
    const ETHAddress = "0x517D553C7Bda6860E13fcC07cd9396F45eC14462"; 

    const Router = await ethers.getContractFactory("UniswapV2Router02");

    const router = await Router.deploy(factoryAddress, ETHAddress);
    await router.deploymentTransaction().wait(); 

    console.log("UniswapV2Router02 deployed to:", await router.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
