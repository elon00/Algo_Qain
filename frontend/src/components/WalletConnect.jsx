import React, { useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

const peraWallet = new PeraWalletConnect();

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isTestMode, setIsTestMode] = useState(import.meta.env.VITE_TEST_MODE === 'true');

  async function connect() {
    try {
      setIsLoading(true);
      setStatus({ type: 'info', message: 'Connecting to Pera Wallet...' });

      const newAccounts = await peraWallet.connect();
      setAccount(newAccounts[0]);
      setStatus({ type: 'success', message: 'Pera Wallet connected!' });

      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      console.error(e);
      setStatus({
        type: 'error',
        message: `Connection failed: ${e.message || e}`
      });
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setIsLoading(false);
    }
  }

  async function disconnect() {
    try {
      setIsLoading(true);
      await peraWallet.disconnect();
      setAccount(null);
      setStatus({ type: 'info', message: 'Wallet disconnected' });
      setTimeout(() => setStatus(null), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  if (account || isTestMode) {
    return (
      <div style={{ position: 'relative' }}>
        {/* Status Message */}
        {status && (
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '0',
            left: '0',
            zIndex: 1000
          }}>
            <div className={`status-message status-${status.type}`} style={{
              fontSize: '0.8rem',
              padding: '0.5rem 1rem',
              margin: 0
            }}>
              {status.message}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: isTestMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(0, 212, 170, 0.1)',
          border: `1px solid ${isTestMode ? '#ffc107' : 'var(--success-color)'}`,
          borderRadius: '12px',
          fontSize: '0.9rem'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isTestMode ? '#ffc107' : 'var(--success-color)',
            animation: 'pulse 2s infinite'
          }}></div>
          <span style={{
            color: isTestMode ? '#ffc107' : 'var(--success-color)',
            fontWeight: '500',
            fontFamily: 'monospace',
            fontSize: '0.8rem'
          }}>
            {isTestMode ? 'TZX4JBX...CKYXM' : `${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
          {!isTestMode && (
            <button
              onClick={disconnect}
              disabled={isLoading}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: '0.2rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--error-color)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {isLoading ? '⏳' : '✕'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* Status Message */}
      {status && (
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '0',
          left: '0',
          zIndex: 1000
        }}>
          <div className={`status-message status-${status.type}`} style={{
            fontSize: '0.8rem',
            padding: '0.5rem 1rem',
            margin: 0
          }}>
            {status.message}
          </div>
        </div>
      )}

      {isTestMode ? (
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(255, 193, 7, 0.1)',
          border: '1px solid #ffc107',
          borderRadius: '12px',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🧪</span>
            <span style={{ color: '#ffc107', fontWeight: '500' }}>Test Mode Active</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Using automated test wallet
          </div>
        </div>
      ) : (
        <button
          className="btn btn-secondary"
          onClick={connect}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            padding: '0.75rem 1.5rem'
          }}
        >
          {isLoading ? (
            <>
              <div className="loading" style={{ width: '16px', height: '16px' }}></div>
              Connecting...
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.1rem' }}>👛</span>
              Connect Pera
            </>
          )}
        </button>
      )}
    </div>
  );
}