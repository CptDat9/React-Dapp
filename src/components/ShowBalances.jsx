import React, { useState, useEffect } from "react";
import { Contract, formatUnits } from "ethers";
import ERC20 from "../abis/ERC20.json";

const ETHAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
const USDTAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; 

const ShowBalances = ({ address, provider }) => {
  const [balances, setBalances] = useState({ ETH: "0", USDT: "0" });

  useEffect(() => {
    if (address && provider) {
      const fetchBalances = async () => {
        try {
          const signer = await provider.getSigner();

          const balanceETH = await provider.getBalance(address);

          
          const USDT = new Contract(USDTAddress, ERC20, signer);
          const balanceUSDT = await USDT.balanceOf(address);

          //  state
          setBalances({
            ETH: formatUnits(balanceETH, 18), 
            USDT: formatUnits(balanceUSDT, 18), 
          });
        } catch (error) {
          console.error("Error fetching balances:", error);
        }
      };

      fetchBalances();
    }
  }, [address, provider]);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>Your Balances:</h3>
      <p>ETH: {balances.ETH}</p>
      <p>USDT: {balances.USDT}</p>
    </div>
  );
};

export default ShowBalances;
