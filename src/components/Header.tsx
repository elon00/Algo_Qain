import React from 'react';
import { ShieldCheck, Cpu, Network, Sparkles, Megaphone, Terminal, Zap, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  blockHeight: number;
  tps: number;
  totalConwayCells: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  blockHeight,
  tps,
  totalConwayCells,
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-indigo-500/20 sticky top-0 z-50 backdrop-blur-md">
      {/* Top Banner Stats */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 px-4 py-1.5 border-b border-indigo-500/10 text-xs text-indigo-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Mainnet Online
          </span>
          <span className="text-slate-300 font-medium">
            Total Supply: <span className="text-cyan-300 font-bold">1,000,000,000,000,000 QALGO</span> (1 Quadrillion)
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>PQC: <strong className="text-white">Dilithium-5 (256-bit)</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>TPS: <strong className="text-amber-300">{tps.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Block: <strong className="text-white">#{blockHeight.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Conway Entropy: <strong className="text-pink-300">{totalConwayCells} cells</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Network className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white font-mono bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Qalgo
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                Web4 PQC
              </span>
            </div>
            <p className="text-xs text-slate-400">Quantum Algorithmic Network</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-indigo-500/20 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('whitepaper')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'whitepaper'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/60 font-semibold'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>White Paper</span>
          </button>

          <button
            onClick={() => setActiveTab('marketing')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'marketing'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Web4 & Marketing</span>
          </button>

          <button
            onClick={() => setActiveTab('conway')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'conway'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Conway AI Automaton</span>
          </button>

          <button
            onClick={() => setActiveTab('pqc')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pqc'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>PQC Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'explorer'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Explorer & Node</span>
          </button>

          <button
            onClick={() => setActiveTab('agents')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'agents'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Agentic Chatbots</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
