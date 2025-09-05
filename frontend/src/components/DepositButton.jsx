import React, { useState } from "react";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import algosdk from "algosdk";

const myAlgoWallet = new MyAlgoConnect();

export default function DepositButton({ escrowAddress }) {
  const [account, setAccount] = useState(null);
  const [amountAlgo, setAmountAlgo] = useState("0.1");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isTestMode, setIsTestMode] = useState(import.meta.env.VITE_TEST_MODE === 'true');

  async function connect() {
    try {
      setIsLoading(true);
      setStatus({ type: 'info', message: 'Connecting to wallet...' });

      const accs = await myAlgoWallet.connect();
      setAccount(accs[0].address);
      setStatus({ type: 'success', message: 'Wallet connected successfully!' });

      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus({
        type: 'error',
        message: `Connection failed: ${e.message || e}`
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function deposit() {
    if (!account && !isTestMode) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    try {
      setIsLoading(true);
      setStatus({ type: 'info', message: 'Preparing transaction...' });

      if (isTestMode) {
        // Use backend API for test mode
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/deposits/deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amountAlgo),
            escrow_address: escrowAddress
          })
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.statusText}`);
        }

        const result = await response.json();
        setStatus({
          type: 'success',
          message: `🎉 Test deposit successful! Transaction ID: ${result.txid}`
        });
      } else {
        // Original wallet-based deposit
        const micro = Math.round(parseFloat(amountAlgo) * 1e6);
        const ALGOD_ADDRESS = import.meta.env.VITE_ALGOD_ADDRESS || "https://testnet-algorand.api.purestake.io/ps2";
        const ALGOD_TOKEN = import.meta.env.VITE_ALGOD_TOKEN || "";

        const headers = ALGOD_TOKEN ? { "X-API-Key": ALGOD_TOKEN } : {};
        const client = new algosdk.Algodv2('', ALGOD_ADDRESS, headers);

        setStatus({ type: 'info', message: 'Getting transaction parameters...' });
        const params = await client.getTransactionParams().do();

        setStatus({ type: 'info', message: 'Creating transaction...' });
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: account,
          to: escrowAddress,
          amount: micro,
          suggestedParams: params,
        });

        setStatus({ type: 'info', message: 'Please sign the transaction in your wallet...' });
        const signedTxs = await myAlgoWallet.signTransaction([txn.toByte()]);
        const blob = signedTxs[0].blob || signedTxs[0].signedTransaction;

        if (!blob) throw new Error("No signed transaction blob returned by wallet");

        setStatus({ type: 'info', message: 'Submitting transaction...' });
        const resp = await client.sendRawTransaction(blob).do();

        setStatus({
          type: 'success',
          message: `🎉 Deposit successful! Transaction ID: ${resp.txId}`
        });
      }

    } catch (e) {
      console.error(e);
      setStatus({
        type: 'error',
        message: `Transaction failed: ${e.message || e}`
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Status Messages */}
      {status && (
        <div className={`status-message status-${status.type}`} style={{ marginBottom: '1.5rem' }}>
          {status.message}
        </div>
      )}

      {/* Test Mode Toggle */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Test Mode:
          </label>
          <button
            onClick={() => setIsTestMode(!isTestMode)}
            style={{
              padding: '0.5rem 1rem',
              background: isTestMode ? 'var(--success-color)' : 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isTestMode ? 'ON' : 'OFF'}
          </button>
        </div>
        <p style={{
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.8rem'
        }}>
          {isTestMode ? 'Using automated test wallet' : 'Using connected wallet'}
        </p>
      </div>

      {/* Wallet Connection */}
      {!isTestMode && !account ? (
        <div style={{ marginBottom: '2rem' }}>
          <button
            className="btn btn-primary"
            onClick={connect}
            disabled={isLoading}
            style={{
              width: '100%',
              fontSize: '1.1rem',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? (
              <>
                <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                Connecting...
              </>
            ) : (
              <>
                🔗 Connect MyAlgo Wallet
              </>
            )}
          </button>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginTop: '1rem'
          }}>
            Connect your wallet to start depositing ALGO tokens
          </p>
        </div>
      ) : (!isTestMode && account) ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(0, 212, 170, 0.1)',
            border: '1px solid var(--success-color)',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Connected Wallet
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: 'var(--success-color)',
              wordBreak: 'break-all'
            }}>
              {account}
            </div>
          </div>
        </div>
      ) : isTestMode ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 193, 7, 0.1)',
            border: '1px solid #ffc107',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Test Wallet Active
            </div>
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#ffc107',
              wordBreak: 'break-all'
            }}>
              TZX4JBXB...CKYXM
            </div>
          </div>
        </div>
      ) : null}

      {/* Deposit Form */}
      {(account || isTestMode) && (
        <div>
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              💰 Deposit Amount
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>(ALGO)</span>
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={amountAlgo}
              onChange={(e) => setAmountAlgo(e.target.value)}
              className="input-field"
              placeholder="Enter amount in ALGO"
              disabled={isLoading}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem'
            }}>
              <span>≈ ${(parseFloat(amountAlgo) * 0.5).toFixed(2)} USD</span>
              <span>Min: 0.1 ALGO</span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={deposit}
            disabled={isLoading || !amountAlgo || parseFloat(amountAlgo) < 0.1 || (!isTestMode && !account)}
            style={{
              width: '100%',
              fontSize: '1.1rem',
              padding: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {isLoading ? (
              <>
                <div className="loading" style={{ width: '20px', height: '20px' }}></div>
                Processing...
              </>
            ) : (
              <>
                🚀 {isTestMode ? 'Test ' : ''}Deposit {amountAlgo} ALGO
              </>
            )}
          </button>

          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span>ℹ️</span>
              <strong>Deposit Information</strong>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>Funds will be deposited to the escrow contract</li>
              <li>Transaction fees: ~0.001 ALGO</li>
              <li>Confirmation time: ~4.5 seconds</li>
              <li>All deposits are recorded on-chain</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}