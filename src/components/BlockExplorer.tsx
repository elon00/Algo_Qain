import React, { useState } from 'react';
import { Terminal, Box, Layers, ArrowUpRight, CheckCircle2, Cpu, Globe, Search, Code, ShieldCheck } from 'lucide-react';
import { Block, Transaction } from '../types';

interface BlockExplorerProps {
  blocks: Block[];
  transactions: Transaction[];
  onDeployContract: (code: string) => void;
}

export const BlockExplorer: React.FC<BlockExplorerProps> = ({
  blocks,
  transactions,
  onDeployContract,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contractCode, setContractCode] = useState(`// Qalgo Web4 PyTeal Contract
#pragma version 8
txn ApplicationID
int 0
==
bnz handle_create
int 1
return

handle_create:
  byte "PQC_DILITHIUM5_SECURITY_OK"
  app_global_put
  int 1
  return`);

  const filteredBlocks = blocks.filter(
    (b) =>
      b.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.index.toString().includes(searchTerm) ||
      b.conwayPatternName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTxs = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Explorer Search & Stats Header */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Mainnet Explorer & Web4 Node Matrix
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Block Explorer & Smart Contract Studio
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Inspect post-quantum blocks, Conway entropy seeds, PQC verified transactions, and Web4 peer-to-peer node health.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search block #, hash, or address..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Grid: Blocks & Transactions Stream (8 Cols) vs Contract Deployer (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Blocks & Txs (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Blocks List */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mined Blocks ({blocks.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Consensus: Conway Zero-Knowledge</span>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {filteredBlocks.map((block) => (
                <div
                  key={block.hash}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">#{block.index}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        Seed: {block.conwayPatternName}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="truncate text-slate-400">
                      Hash: <span className="text-cyan-300">{block.hash}</span>
                    </div>
                    <div className="truncate text-slate-400">
                      PQC Sig: <span className="text-emerald-400">{block.pqcSignature}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span>TXs: <strong className="text-white">{block.transactionsCount}</strong></span>
                    <span>Algorithm: <strong className="text-cyan-300">{block.algorithm}</strong></span>
                    <span>Entropy: <strong className="text-pink-300">{block.entropySeed.slice(0, 14)}...</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Live Transactions Stream ({transactions.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {filteredTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-bold">{tx.id.slice(0, 12)}...</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {tx.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      From: <span className="text-slate-300">{tx.from.slice(0, 16)}...</span> → To: <span className="text-slate-300">{tx.to.slice(0, 16)}...</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 font-mono">
                    <span className="font-bold text-emerald-400 text-sm">
                      +{tx.amount.toLocaleString()} QAIN
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> PQC OK
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Deploy Contract & Web4 Peer Map (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Smart Contract Deployer */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Code className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Deploy TEAL Smart Contract
              </h3>
            </div>

            <textarea
              value={contractCode}
              onChange={(e) => setContractCode(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
            />

            <button
              onClick={() => onDeployContract(contractCode)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Compile & Deploy to Web4 Mesh</span>
            </button>
          </div>

          {/* Web4 Node Mesh Card */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Web4 PQC AI Mesh Nodes
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              {[
                { city: 'Tokyo - JP-1', ping: '12ms', status: 'Active (PQC-5)', version: 'v4.2.1' },
                { city: 'Frankfurt - DE-1', ping: '18ms', status: 'Active (PQC-5)', version: 'v4.2.1' },
                { city: 'San Francisco - US-W', ping: '24ms', status: 'Active (PQC-5)', version: 'v4.2.1' },
                { city: 'London - UK-1', ping: '15ms', status: 'Active (PQC-5)', version: 'v4.2.1' },
                { city: 'Singapore - SG-1', ping: '22ms', status: 'Active (PQC-5)', version: 'v4.2.1' },
              ].map((node) => (
                <div key={node.city} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white font-medium">{node.city}</span>
                  </div>
                  <span className="text-[10px] text-cyan-300">{node.ping}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
