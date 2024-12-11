import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import ShowBalances from "./components/ShowBalances";
import Swap from "./components/Swap";
import Liquidity from "./components/Liquidity";

function App() {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);

  return (
    <div style={styles.appContainer}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>CD Protocol</h1>
        <p style={styles.subtitle}>Decentralized Finance </p>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        <ConnectWallet setAddress={setAddress} setProvider={setProvider} />
        {address && provider ? (
          <div style={styles.connectedContainer}>
            <ShowBalances address={address} provider={provider} />
            <Swap address={address} provider={provider} />
            <Liquidity address={address} provider={provider} />
          </div>
        ) : (
          <p style={styles.prompt}>Please connect your wallet to proceed.</p>
        )}
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 CD Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  appContainer: {
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    color: "#333",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "#4A90E2",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: "bold",
  },
  subtitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontStyle: "italic",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: "800px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
  connectedContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  prompt: {
    fontSize: "1.1rem",
    textAlign: "center",
    color: "#555",
    marginTop: "20px",
  },
  footer: {
    width: "100%",
    textAlign: "center",
    padding: "10px 0",
    backgroundColor: "#4A90E2",
    color: "#fff",
    marginTop: "20px",
    fontSize: "0.9rem",
  },
};

export default App;
