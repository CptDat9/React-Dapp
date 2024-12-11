import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import UniswapV2Factory from '../abis/UniswapV2Factory.json';
import UniswapV2Pair from '../abis/UniswapV2Pair.json'; 

const factoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

const ETH_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Liquidity = () => {
  const [account, setAccount] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [pairAddress, setPairAddress] = useState('');
  const [reserves, setReserves] = useState(null);

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

  const getPoolReserves = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factory = new Contract(factoryAddress, UniswapV2Factory, signer);

    try {
      // Lấy địa chỉ pair của tokenA và tokenB
      const pairAddr = await factory.getPair(ETH_ADDRESS, USDT_ADDRESS);
      setPairAddress(pairAddr);

      if (pairAddr === '0x0000000000000000000000000000000000000000') {
        return alert('Pair does not exist.');
      }

      const pairContract = new Contract(pairAddr, UniswapV2Pair, signer);
      const reserves = await pairContract.getReserves();
      setReserves({
        reserveA: reserves[0].toString(),
        reserveB: reserves[1].toString(),
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch pool reserves.');
    }
  };

  const addLiquidity = async () => {
    if (!account) return alert('Please connect your wallet first!');
    if (!amountA || !amountB) return alert('Please enter valid amounts.');

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const factory = new Contract(factoryAddress, UniswapV2Factory, signer);

    try {
      const tx = await factory.createPair(ETH_ADDRESS, USDT_ADDRESS);
      await tx.wait();
      alert('Liquidity pair created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create liquidity pair.');
    }
  };

  const removeLiquidity = async () => {
    if (!pairAddress) return alert('No pair address found.');

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const pairContract = new Contract(pairAddress, UniswapV2Pair, signer);

    try {
      const tx = await pairContract.burn(account); // Giả sử người dùng burn LP token
      await tx.wait();
      alert('Liquidity removed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to remove liquidity.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Liquidity Pool Management</h2>
      <button onClick={connectWallet} style={{ padding: '5px 10px', marginBottom: '10px' }}>
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
      <div>
        <h3>Manage Pool</h3>
        {/* Không cần nhập Token A và Token B nữa, vì chúng đã cố định */}
        <input
          type="text"
          placeholder="Amount ETH (optional)"
          value={amountA}
          onChange={(e) => setAmountA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount USDT (optional)"
          value={amountB}
          onChange={(e) => setAmountB(e.target.value)}
        />
        <button onClick={addLiquidity}>Add Liquidity</button>
        <button onClick={removeLiquidity} style={{ marginLeft: '10px' }}>
          Remove Liquidity
        </button>
        <button onClick={getPoolReserves} style={{ marginLeft: '10px' }}>
          View Pool Reserves
        </button>
        {pairAddress && (
          <div>
            <p>Pair Address: {pairAddress}</p>
            {reserves && (
              <p>
                Reserves - ETH: {reserves.reserveA}, USDT: {reserves.reserveB}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidity;
