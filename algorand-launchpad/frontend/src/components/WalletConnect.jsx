import React, { useState } from 'react';
import { PeraWalletConnect } from 'pera-wallet-connect';

const WalletConnect = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const peraWallet = new PeraWalletConnect();

    const connectWallet = async () => {
        const accounts = await peraWallet.connect();
        setWalletAddress(accounts[0]);
        setIsConnected(true);
    };

    const disconnectWallet = async () => {
        await peraWallet.disconnect();
        setWalletAddress(null);
        setIsConnected(false);
    };

    return (
        <div>
            {isConnected ? (
                <div>
                    <p>Connected: {walletAddress}</p>
                    <button onClick={disconnectWallet}>Disconnect</button>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
            )}
        </div>
    );
};

export default WalletConnect;