import React, { useState } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import UniswapV2Router02 from '../abis/UniswapV2Router02.json';
import ERC20 from '../abis/ERC20.json';

const routerAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

const Swap = () => {
  const [account, setAccount] = useState(null);
  const [amountIn, setAmountIn] = useState('');
  const [tokenIn, setTokenIn] = useState('ETH');
  const [tokenOut, setTokenOut] = useState('USDT');

  const tokenAddresses = {
    ETH: "0x5FbDB2315678afecb367f032d93F642f64180aa3", 
    USDT: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
        alert('Could not connect to MetaMask');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const approveToken = async (tokenAddress, amount) => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new Contract(tokenAddress, ERC20, signer);

    try {
      const tx = await tokenContract.approve(routerAddress, amount);
      await tx.wait();
      alert("Token approved!");
    } catch (err) {
      console.error("Approval failed:", err);
      throw new Error("Token approval failed.");
    }
  };

  const swapTokens = async () => {
    if (!account) return alert("Please connect your wallet first!");

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const router = new Contract(routerAddress, UniswapV2Router02, signer);

    const amountInWei = parseUnits(amountIn, 18);
    const amountOutMin = parseUnits("0", 18); 
    const path = [tokenAddresses[tokenIn], tokenAddresses[tokenOut]];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    try {
      await approveToken(tokenAddresses[tokenIn], amountInWei); 
      const tx = await router.swapExactTokensForTokens(
        amountInWei,
        amountOutMin,
        path,
        account,
        deadline
      );
      await tx.wait();
      alert("Swap success!");
    } catch (err) {
      console.error("Swap error:", err);
      alert("Swap failed!");
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Swap Tokens</h2>
      <button onClick={connectWallet} style={{ padding: '5px 10px', marginBottom: '10px' }}>
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
      <div>
        <input
          type="text"
          placeholder="Amount In"
          value={amountIn}
          onChange={(e) => setAmountIn(e.target.value)}
        />
        <select value={tokenIn} onChange={(e) => setTokenIn(e.target.value)}>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>
        <span>→</span>
        <select value={tokenOut} onChange={(e) => setTokenOut(e.target.value)}>
          <option value="ETH">ETH</option>
          <option value="USDT">USDT</option>
        </select>
      </div>
      <button onClick={swapTokens}>Swap</button>
    </div>
  );
};

export default Swap;