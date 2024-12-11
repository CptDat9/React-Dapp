import React from "react";
import { BrowserProvider } from "ethers"; 

const ConnectWallet = ({ setAddress, setProvider }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); 
        await provider.send("eth_requestAccounts", []); 
        const signer = await provider.getSigner(); 
        const account = await signer.getAddress(); 
        setAddress(account);  // cap nhat trong state
        setProvider(provider); 
        alert(`Connected: ${account}`);
      } catch (err) {
        console.error("Connection error:", err);
        alert("Could not connect to MetaMask. Please try again.");
      }
    } else {
      alert("MetaMask is not installed! Please install MetaMask to continue.");
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <button
        onClick={connectWallet}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Connect Wallet
      </button>
    </div>
  );
};

export default ConnectWallet;
