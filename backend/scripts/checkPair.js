const { ethers } = require("hardhat");

const checkPair = async () => {
    const [signer] = await ethers.getSigners();

    const factoryAddress = "0xA91629c5Dceecd0BC57CDee07E2471218C202384"; 

    const factoryABI = [
        {
            "inputs": [
                { "internalType": "address", "name": "tokenA", "type": "address" },
                { "internalType": "address", "name": "tokenB", "type": "address" }
            ],
            "name": "getPair",
            "outputs": [
                { "internalType": "address", "name": "pair", "type": "address" }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];
    const factory = new ethers.Contract(factoryAddress, factoryABI, signer);
    const ETHAddress = "0x517D553C7Bda6860E13fcC07cd9396F45eC14462"; 
    const USDTAddress = "0x7a9c21537BF058F4b01213f46a84b9F72e310D9B";

    console.log("Checking for ETH-USDT pair...");
    try {
        const pairAddress = await factory.getPair(ETHAddress, USDTAddress);

        const AddressZero = "0x0000000000000000000000000000000000000000";
        if (pairAddress && pairAddress !== AddressZero) {
            console.log(`ETH-USDT pair already exists at address: ${pairAddress}`);
        } else {
            console.log("ETH-USDT pair does not exist.");
        }
    } catch (error) {
        console.error("Error checking pair:", error);
    }
};

checkPair();
