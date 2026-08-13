import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { MarketingHub } from './components/MarketingHub';
import { ConwayAutomaton } from './components/ConwayAutomaton';
import { PQCStudio } from './components/PQCStudio';
import { BlockExplorer } from './components/BlockExplorer';
import { AgenticChatbots } from './components/AgenticChatbots';
import { WhitePaper } from './components/WhitePaper';
import { Block, Transaction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('whitepaper');
  const [blockHeight, setBlockHeight] = useState<number>(1000000);
  const [tps, setTps] = useState<number>(248900);
  const [totalConwayCells, setTotalConwayCells] = useState<number>(128);

  const [blocks, setBlocks] = useState<Block[]>([
    {
      index: 1000000,
      hash: '0xQALGO_GENESIS_00000000000000000000000000000000000000000000000000000000',
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      timestamp: Date.now() - 60000,
      nonce: 42069,
      entropySeed: '0xQALGO_CONWAY_GENESIS_SEED_1000T',
      transactionsCount: 1000,
      pqcSignature: 'DILITHIUM5_SIG_GENESIS_VERIFIED_OK',
      algorithm: 'Dilithium-5',
      gasUsed: 21000,
      conwayPatternName: 'Gosper Glider Gun',
    },
    {
      index: 999999,
      hash: '0xQALGO_BLOCK_00000000000000000000000000000000000000000000000000000001',
      previousHash: '0xQALGO_BLOCK_00000000000000000000000000000000000000000000000000000002',
      timestamp: Date.now() - 120000,
      nonce: 1337,
      entropySeed: '0xQALGO_PULSAR_SEED_888',
      transactionsCount: 842,
      pqcSignature: 'DILITHIUM5_SIG_OK_0x9f8a',
      algorithm: 'Dilithium-5',
      gasUsed: 18500,
      conwayPatternName: 'Pulsar',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_pqc_1000001',
      from: 'QALGO1QGENESIS_FOUNDATION_NODE_1000T',
      to: 'QALGO1Q9876543210FEDCBA9876543210FEDCBA',
      amount: 1000000000, // 1 Billion QALGO
      fee: 10,
      timestamp: Date.now() - 15000,
      status: 'confirmed',
      signature: 'PQC_DILITHIUM_5_SIG_VERIFIED',
      type: 'transfer',
    },
    {
      id: 'tx_conway_mint_100',
      from: '0xCONWAY_AUTOMATON_EMISSION_CONTRACT',
      to: 'QALGO1Q9876543210FEDCBA9876543210FEDCBA',
      amount: 250000000,
      fee: 5,
      timestamp: Date.now() - 45000,
      status: 'confirmed',
      signature: 'PQC_DILITHIUM_5_SIG_VERIFIED',
      type: 'conway_mint',
    },
  ]);

  // Live network ticker simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTps(245000 + Math.floor(Math.random() * 8000));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#ec4899', '#6366f1', '#10b981'],
    });
  };

  const handleMineBlockFromConway = (
    entropySeed: string,
    patternName: string,
    cellCount: number
  ) => {
    const nextIndex = blockHeight + 1;
    const randomHex = Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newBlock: Block = {
      index: nextIndex,
      hash: `0xQALGO_BLOCK_${randomHex.toUpperCase()}`,
      previousHash: blocks[0].hash,
      timestamp: Date.now(),
      nonce: Math.floor(Math.random() * 100000),
      entropySeed: entropySeed,
      transactionsCount: Math.floor(Math.random() * 500) + 200,
      pqcSignature: `DILITHIUM5_SIG_${randomHex.slice(0, 8)}_OK`,
      algorithm: 'Dilithium-5',
      gasUsed: 22000,
      conwayPatternName: patternName,
    };

    setBlocks((prev) => [newBlock, ...prev]);
    setBlockHeight(nextIndex);
    setTotalConwayCells((c) => c + cellCount);
    triggerConfetti();

    // Add corresponding mint transaction
    const mintTx: Transaction = {
      id: `tx_conway_${nextIndex}`,
      from: '0xCONWAY_AUTOMATON_EMISSION_CONTRACT',
      to: 'QALGO1Q9876543210FEDCBA9876543210FEDCBA',
      amount: 50000000,
      fee: 2,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: `DILITHIUM5_${randomHex.slice(0, 6)}`,
      type: 'conway_mint',
    };
    setTransactions((prev) => [mintTx, ...prev]);
  };

  const handleFaucetRequest = (amount: number, recipientAddr: string) => {
    const newTx: Transaction = {
      id: `tx_faucet_${Date.now()}`,
      from: 'QALGO1Q_TOTAL_SUPPLY_FAUCET_1000T',
      to: recipientAddr,
      amount: amount,
      fee: 0,
      timestamp: Date.now(),
      status: 'confirmed',
      signature: 'PQC_DILITHIUM_5_FAUCET_SIG_OK',
      type: 'pqc_faucet',
    };

    setTransactions((prev) => [newTx, ...prev]);
    triggerConfetti();
  };

  const handleDeployContract = (code: string) => {
    triggerConfetti();
    alert('TEAL Smart Contract compiled & deployed to Qalgo Web4 PQC Mesh!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      <div>
        {/* Header Navigation */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          blockHeight={blockHeight}
          tps={tps}
          totalConwayCells={totalConwayCells}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {activeTab === 'whitepaper' && <WhitePaper onNavigateTab={setActiveTab} />}
          {activeTab === 'marketing' && <MarketingHub onNavigateTab={setActiveTab} />}
          {activeTab === 'conway' && (
            <ConwayAutomaton onMineBlockFromConway={handleMineBlockFromConway} />
          )}
          {activeTab === 'pqc' && <PQCStudio onFaucetRequest={handleFaucetRequest} />}
          {activeTab === 'explorer' && (
            <BlockExplorer
              blocks={blocks}
              transactions={transactions}
              onDeployContract={handleDeployContract}
            />
          )}
          {activeTab === 'agents' && <AgenticChatbots />}
        </main>
      </div>

      {/* Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Qalgo Web4 Network • Total Supply: 1,000,000,000,000,000 QALGO</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Security: CRYSTALS-Dilithium-5</span>
            <span>•</span>
            <span>Engine: Conway AI Automaton</span>
            <span>•</span>
            <span>Agents: Gemini 3.6 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
