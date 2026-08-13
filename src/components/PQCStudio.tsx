import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, Cpu, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Send, ShieldAlert } from 'lucide-react';
import { PQCKeyPair } from '../types';

interface PQCStudioProps {
  onFaucetRequest: (amount: number, recipientAddr: string) => void;
}

export const PQCStudio: React.FC<PQCStudioProps> = ({ onFaucetRequest }) => {
  const [keyPair, setKeyPair] = useState<PQCKeyPair>({
    algorithm: 'CRYSTALS-Dilithium-5',
    publicKey: 'pqc_pk_dilithium_5_9f8a3b2c1e4d7f0a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    privateKey: 'pqc_sk_enc_8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c',
    walletAddress: 'QALGO1Q9876543210FEDCBA9876543210FEDCBA',
    quantumSecurityBits: 256,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [attackStatus, setAttackStatus] = useState<'idle' | 'simulating' | 'rsa_broken' | 'pqc_secured'>('idle');
  const [faucetAmount, setFaucetAmount] = useState<number>(100000000); // 100M QALGO
  const [recipient, setRecipient] = useState<string>(keyPair.walletAddress);

  const generateNewKeyPair = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/pqc/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'CRYSTALS-Dilithium-5' }),
      });
      const data = await res.json();
      setKeyPair({
        algorithm: data.algorithm || 'CRYSTALS-Dilithium-5',
        publicKey: data.publicKey,
        privateKey: data.privateKey,
        walletAddress: data.walletAddress,
        quantumSecurityBits: data.quantumSecurityBits || 256,
      });
      setRecipient(data.walletAddress);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const runQuantumAttackSimulation = () => {
    setAttackStatus('simulating');
    setTimeout(() => {
      setAttackStatus('rsa_broken');
      setTimeout(() => {
        setAttackStatus('pqc_secured');
      }, 1500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                CRYSTALS-Dilithium-5 & Kyber-1024
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Lattice-Based Post-Quantum Cryptography
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Post-Quantum Cryptography (PQC) Security Hub
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              QAIN replaces vulnerable ECDSA/RSA cryptography with NIST-standardized lattice-based Dilithium-5 digital signatures, immunizing transactions against quantum Shor algorithm attacks.
            </p>
          </div>

          <button
            onClick={generateNewKeyPair}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Generate PQC Keypair</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Keypair Generator & Wallet Card (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Quantum-Resistant Wallet Address</h3>
                <p className="text-xs text-slate-400">Standard: Dilithium-5 (Level 5 Security - 256 Quantum Bits)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30">
              Active Keypair
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Post-Quantum Address (PQC Address)
              </label>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm text-cyan-300 font-semibold select-all break-all">
                {keyPair.walletAddress}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Public Key (Dilithium-5 Lattice Vectors)
              </label>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 select-all break-all">
                {keyPair.publicKey}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Encrypted Private Seed
              </label>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-amber-300/80 select-all break-all">
                {keyPair.privateKey}
              </div>
            </div>
          </div>

          {/* Faucet Box */}
          <div className="pt-4 border-t border-slate-800 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                PQC Testnet Faucet
              </span>
              <span className="text-xs text-slate-400">Total Supply: 1,000,000,000,000,000 QAIN</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="number"
                value={faucetAmount}
                onChange={(e) => setFaucetAmount(Number(e.target.value))}
                className="w-full sm:w-1/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                placeholder="Amount QAIN"
              />
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full sm:w-2/3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="Target Wallet"
              />
              <button
                onClick={() => onFaucetRequest(faucetAmount, recipient)}
                className="w-full sm:w-auto whitespace-nowrap px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
              >
                Claim QAIN
              </button>
            </div>
          </div>
        </div>

        {/* Quantum Threat Simulator (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Shor's Algorithm Simulator</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Simulate a 1,000-qubit Quantum Computer running Shor's algorithm against traditional ECDSA/RSA cryptography vs Qalgo's Lattice Cryptography.
            </p>

            <div className="space-y-3">
              {/* RSA Box */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                attackStatus === 'rsa_broken' || attackStatus === 'pqc_secured'
                  ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">ECDSA / RSA-2048</span>
                  {attackStatus === 'rsa_broken' || attackStatus === 'pqc_secured' ? (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> BROKEN IN 0.04s
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Legacy Web2/Web3</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Private keys extracted by quantum discrete logarithm solver.
                </p>
              </div>

              {/* Dilithium Box */}
              <div className={`p-3.5 rounded-xl border transition-all ${
                attackStatus === 'pqc_secured'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase">Qalgo CRYSTALS-Dilithium-5</span>
                  {attackStatus === 'pqc_secured' ? (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> 100% IMMUNE
                    </span>
                  ) : (
                    <span className="text-xs text-cyan-400 font-bold">Post-Quantum Lattice</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  NIST Level 5 vector lattice problems remain intractable for quantum computers.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={runQuantumAttackSimulation}
            disabled={attackStatus === 'simulating'}
            className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Cpu className="w-4 h-4 text-cyan-300" />
            <span>{attackStatus === 'simulating' ? 'Running Quantum Attack Vector...' : 'Simulate Quantum Threat Attack'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
