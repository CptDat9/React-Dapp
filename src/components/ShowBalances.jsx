import React, { useState, useEffect } from "react";
import { Contract } from "ethers";
import ERC20 from "../abis/ERC20.json"; 

const ETHAddress = "0x517D553C7Bda6860E13fcC07cd9396F45eC14462"; 
const USDTAddress = "0x7a9c21537BF058F4b01213f46a84b9F72e310D9B"; 

const ShowBalances = ({ address, provider }) => {
  const [balances, setBalances] = useState({ ETH: "0", USDT: "0" });

  useEffect(() => {
    if (address && provider) {
      const fetchBalances = async () => { 
        try {
          const ETH = new Contract(ETHAddress, ERC20, provider);
          const balanceETH = await ETH.balanceOf(address);

          const USDT = new Contract(USDTAddress, ERC20, provider);
          const balanceUSDT = await USDT.balanceOf(address);

          setBalances({
            ETH: balanceETH.toString(), 
            USDT: balanceUSDT.toString(), 
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
      <h3>Your Token Balances:</h3>
      <p>ETH (Wei): {balances.ETH}</p> 
      <p>USDT (Token): {balances.USDT}</p> 
    </div>
  );
};

export default ShowBalances;
