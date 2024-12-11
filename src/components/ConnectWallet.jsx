import React from "react";
import { BrowserProvider } from "ethers"; // Import BrowserProvider chính xác từ ethers

const ConnectWallet = ({ setAddress, setProvider }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum); // Sử dụng BrowserProvider
        await provider.send("eth_requestAccounts", []); // Yêu cầu người dùng kết nối tài khoản
        const signer = await provider.getSigner(); // Lấy signer từ provider
        const account = await signer.getAddress(); // Lấy địa chỉ ví
        setAddress(account); // Cập nhật địa chỉ ví trong state
        setProvider(provider); // Cập nhật provider trong state
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
