import React, { useState } from 'react';
import { BrowserProvider, Contract  } from 'ethers';
import UniswapV2Router02 from '../abis/UniswapV2Router02.json';
import UniswapV2Pair from '../abis/UniswapV2Pair.json';
import ERC20 from '../abis/ERC20.json';
const BN = require('bn.js');
const routerAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const PAIR_ADDRESS = "0x70caf53Cd0f9dd6ec6cd796fAa090F7Bf9AE6a33";
const ETH_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const USDT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const Liquidity = () => {
  const [account, setAccount] = useState(null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');
  const [reserves, setReserves] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
        alert('Could not connect to MetaMask.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  const getPoolReserves = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
  
    try {
      const pairContract = new Contract(PAIR_ADDRESS, UniswapV2Pair, signer);
      const reserves = await pairContract.getReserves();
      const token0 = await pairContract.token0();
      const token1 = await pairContract.token1();
  
      const formattedReserves = {
        [token0]: reserves[0].toString(),
        [token1]: reserves[1].toString(),
      };
  
      setReserves(formattedReserves);
      alert('Loaded pool reserves successfully!');
    } catch (err) {
      console.error('Error fetching pool reserves:', err.message);
      alert('Failed to load pool reserves.');
    }
  };
  


  const addLiquidity = async () => {
    if (!account) return alert('Please connect your wallet first!');
    if (!amountA || !amountB) return alert('Please enter valid amounts.');

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
        const routerContract = new Contract(routerAddress, UniswapV2Router02, signer);
        const usdtContract = new Contract(USDT_ADDRESS, ERC20, signer);

        const allowance = new BN(await usdtContract.allowance(account, routerAddress));
        const amountBUSDT = new BN(amountB); 

        if (allowance.lt(amountBUSDT)) {
            const approveTx = await usdtContract.approve(routerAddress, amountBUSDT.toString()); 
            await approveTx.wait();
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; 

        const tx = await routerContract.addLiquidity(
            ETH_ADDRESS,
            USDT_ADDRESS,
            amountA.toString(),
            amountBUSDT.toString(),
            0,
            0,
            PAIR_ADDRESS,
            deadline
        );

        await tx.wait();
        alert('Liquidity added successfully to the pair address!');
    } catch (err) {
        console.error(err);
        alert('Failed to add liquidity.');
    }
};
  const removeLiquidity = async () => {
    if (!account) return alert('Please connect your wallet first!');
    if (!removeAmount || isNaN(removeAmount) || parseFloat(removeAmount) <= 0) {
      return alert('Please enter a valid liquidity amount.');
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
      const routerContract = new Contract(routerAddress, UniswapV2Router02, signer);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 phuts

      const liquidity = (removeAmount * 10 ** 18).toString();

      const tx = await routerContract.removeLiquidity(
        ETH_ADDRESS,
        USDT_ADDRESS,
        liquidity.toString(),
        0,
        0,
        account,
        deadline
      );
      await tx.wait();
      alert('Liquidity removed successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to remove liquidity.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#333' }}>Liquidity Pool Management</h2>
      <button
        onClick={connectWallet}
        style={{
          padding: '10px 20px',
          margin: '10px 0',
          backgroundColor: account ? '#4CAF50' : '#008CBA',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
      </button>
      <div style={{ marginTop: '20px' }}>
        <h3>Manage Pool</h3>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Amount ETH"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            style={{ padding: '10px', marginRight: '10px', width: '45%' }}
          />
          <input
            type="text"
            placeholder="Amount USDT"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            style={{ padding: '10px', width: '45%' }}
          />
        </div>
        <button
          onClick={addLiquidity}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Liquidity
        </button>
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Liquidity amount to remove"
            value={removeAmount}
            onChange={(e) => setRemoveAmount(e.target.value)}
            style={{ padding: '10px', width: '90%' }}
          />
        </div>
        <button
          onClick={removeLiquidity}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Remove Liquidity
        </button>
        <button
          onClick={getPoolReserves}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View Pool Reserves
        </button>
        {reserves && (
          <div style={{ marginTop: '20px' }}>
            <h4>Current Pool Reserves</h4>
            <p>ETH: {reserves.reserveA}</p>
            <p>USDT: {reserves.reserveB}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Liquidity;
