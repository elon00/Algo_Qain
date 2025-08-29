import React, { useState } from "react";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";

const myAlgoWallet = new MyAlgoConnect();

export default function DepositButton({ escrowAddress }) {
  const [account, setAccount] = useState(null);
  const [amountAlgo, setAmountAlgo] = useState("0.1");

  async function connect() {
    try {
      const accs = await myAlgoWallet.connect();
      setAccount(accs[0].address);
    } catch (e) {
      alert("Connect failed: " + (e.message || e));
    }
  }

  async function deposit() {
    if (!account) return alert("Connect wallet first");
    const micro = Math.round(parseFloat(amountAlgo) * 1e6);
    const ALGOD_ADDRESS = import.meta.env.VITE_ALGOD_ADDRESS || "https://testnet-algorand.api.purestake.io/ps2";
    const ALGOD_TOKEN = import.meta.env.VITE_ALGOD_TOKEN || "";
    // Use empty token param and pass headers object per algosdk/browser usage
    const headers = ALGOD_TOKEN ? { "X-API-Key": ALGOD_TOKEN } : {};
    const client = new algosdk.Algodv2('', ALGOD_ADDRESS, headers);

    try {
      const params = await client.getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: account,
        to: escrowAddress,
        amount: micro,
        suggestedParams: params,
      });

      // sign with MyAlgo (pass raw bytes)
      const signedTxs = await myAlgoWallet.signTransaction([txn.toByte()]);
      // myalgo returns array of objects; signed blob typically available as .blob or .signedTransaction
      const blob = signedTxs[0].blob || signedTxs[0].signedTransaction;
      if (!blob) throw new Error("No signed transaction blob returned by wallet");

      const resp = await client.sendRawTransaction(blob).do();
      alert("Deposit submitted, txid: " + resp.txId);
    } catch (e) {
      alert("Deposit failed: " + (e.message || e));
      console.error(e);
    }
  }

  return (
    <div>
      {account ? (
        <div>
          <div>Connected: {account}</div>
          <input value={amountAlgo} onChange={(e)=>setAmountAlgo(e.target.value)} />
          <button onClick={deposit}>Deposit to Escrow</button>
        </div>
      ) : (
        <button onClick={connect}>Connect MyAlgo Wallet</button>
      )}
    </div>
  );
}