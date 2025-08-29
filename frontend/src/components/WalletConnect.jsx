import React, {useState} from "react";
import { PeraWalletConnect } from "pera-wallet-connect";

const peraWallet = new PeraWalletConnect();

export default function WalletConnect() {
  const [account, setAccount] = useState(null);

  async function connect() {
    try {
      const newAccounts = await peraWallet.connect();
      setAccount(newAccounts[0]);
    } catch (e) {
      console.error(e);
      alert("Connect failed: " + (e.message || e));
    }
  }

  async function disconnect() {
    await peraWallet.disconnect();
    setAccount(null);
  }

  return (
    <div>
      {account ? (
        <div>
          <div>Connected: {account}</div>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect}>Connect Pera Wallet</button>
      )}
    </div>
  );
}