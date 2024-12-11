const { ethers } = require("hardhat"); 

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploy contract with account: " + deployer.address);


    const ETH = await ethers.getContractFactory("ETH");
    const eth = await ETH.deploy(ethers.parseEther("1000000"));
    await eth.waitForDeployment(); 
    console.log("ETH token deployed to:", await eth.getAddress());

   
    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy("1000000000000");
    await usdt.waitForDeployment(); 
    console.log("USDT token deployed to:", await usdt.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
