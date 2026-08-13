import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Megaphone, Coins, Sparkles, BookOpen, Calculator, Globe, Copy, Check, FileText } from 'lucide-react';
import { TokenomicsAllocation } from '../types';

const TOKENOMICS_DATA: TokenomicsAllocation[] = [
  {
    category: 'AI Compute & Conway Automata',
    amount: 350000000000000,
    percentage: 35,
    description: 'Autonomous cell state rewards, Gemini Agent execution fees, zero-knowledge seed generation.',
    color: '#ec4899', // Pink
  },
  {
    category: 'PQC Validator Staking',
    amount: 250000000000000,
    percentage: 25,
    description: 'Post-Quantum consensus node rewards for CRYSTALS-Dilithium-5 block signatures.',
    color: '#06b6d4', // Cyan
  },
  {
    category: 'Public Liquidity & Cross-Chain',
    amount: 200000000000000,
    percentage: 20,
    description: 'DEX pools, Algorand bridge wrappers, global exchange liquidity, market stabilization.',
    color: '#6366f1', // Indigo
  },
  {
    category: 'Web4 Agent Grants',
    amount: 100000000000000,
    percentage: 10,
    description: 'Developer grants for agentic chatbots, micro-payments routing, and .qalgo domain names.',
    color: '#10b981', // Emerald
  },
  {
    category: 'Foundation Reserve',
    amount: 100000000000000,
    percentage: 10,
    description: 'Long-term network security reserves, auditing funds, and protocol upgrades.',
    color: '#f59e0b', // Amber
  },
];

interface MarketingHubProps {
  onNavigateTab?: (tab: string) => void;
}

export const MarketingHub: React.FC<MarketingHubProps> = ({ onNavigateTab }) => {
  const [stakeAmount, setStakeAmount] = useState<number>(1000000000); // 1 Billion QALGO
  const [pressRelease, setPressRelease] = useState<string>('');
  const [isGeneratingPress, setIsGeneratingPress] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [targetAudience, setTargetAudience] = useState<string>('Global Crypto Exchanges & Web3 Investors');

  const generatePressRelease = async () => {
    setIsGeneratingPress(true);
    try {
      const res = await fetch('/api/marketing/generate-press', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAudience }),
      });
      const data = await res.json();
      setPressRelease(data.pressRelease);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPress(false);
    }
  };

  const copyPressToClipboard = () => {
    if (!pressRelease) return;
    navigator.clipboard.writeText(pressRelease);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Staking calculation (12.5% APY)
  const yearlyYield = Math.floor(stakeAmount * 0.125);
  const dailyYield = Math.floor(yearlyYield / 365);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Global Web4 Marketing Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Qalgo Post-Quantum AI Blockchain
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300">
              1 Quadrillion (1,000 Trillion) Total Supply
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            Uniting Post-Quantum Cryptography (NIST Dilithium-5), Conway's Cellular Automata Zero-Knowledge Engine, and Agentic AI Chatbots into the premier hyper-scalable Web4 cryptocurrency architecture.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-200">
              Supply: <strong className="text-cyan-300 font-bold">1,000,000,000,000,000 QALGO</strong>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-200">
              Standard: <strong className="text-emerald-400 font-bold">Dilithium-5 + Web4 Mesh</strong>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-200">
              Consensus: <strong className="text-pink-400 font-bold">Conway Cellular Entropy</strong>
            </div>
          </div>

          {onNavigateTab && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('whitepaper')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Read Official Technical & Legal White Paper (v4.2)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tokenomics Visualizer & Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tokenomics Chart & Allocation Table (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">1,000 Trillion Tokenomics Allocation</h3>
                <p className="text-xs text-slate-400">1,000,000,000,000,000 Total Supply Distribution</p>
              </div>
            </div>
          </div>

          {/* Chart & Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOKENOMICS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="amount"
                  >
                    {TOKENOMICS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${(Number(value) / 1e12).toLocaleString()} Trillion QALGO`, 'Allocation']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {TOKENOMICS_DATA.map((item) => (
                <div key={item.category} className="flex items-start gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full mt-0.5 shrink-0" style={{ backgroundColor: item.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{item.category}</span>
                      <span className="font-mono text-cyan-400 font-bold">{item.percentage}%</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table representation */}
          <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5">Amount (QALGO)</th>
                  <th className="p-2.5">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {TOKENOMICS_DATA.map((row) => (
                  <tr key={row.category} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-sans font-medium text-white">{row.category}</td>
                    <td className="p-2.5 text-cyan-300">{(row.amount / 1e12).toLocaleString()} Trillion</td>
                    <td className="p-2.5 text-pink-400 font-bold">{row.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staking Calculator Card (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Staking Yield Calculator</h3>
                <p className="text-xs text-slate-400">Est. 12.5% APY Post-Quantum Validator Staking</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Stake Amount (QALGO)
                </label>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-cyan-300 focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 1000000000"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Daily Rewards</span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    +{dailyYield.toLocaleString()} QALGO
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Annual Return</span>
                  <span className="text-base font-bold font-mono text-pink-400">
                    +{yearlyYield.toLocaleString()} QALGO
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-xl">
            <span className="text-xs font-bold text-indigo-300 block mb-1">Global Standard Security Guarantee</span>
            <p className="text-[11px] text-slate-300 leading-normal">
              Staked QALGO is protected by Dilithium-5 lattice proofs and hardware-enclave validation nodes across the Web4 mesh.
            </p>
          </div>
        </div>
      </div>

      {/* AI Press Release Generator Section */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Global Marketing & Press Release Generator</h3>
              <p className="text-xs text-slate-400">Powered by Gemini AI - Compose official announcements for Tier-1 outlets</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              placeholder="Target Audience"
            />
            <button
              onClick={generatePressRelease}
              disabled={isGeneratingPress}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingPress ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPress ? 'Generating...' : 'Generate Press Release'}</span>
            </button>
          </div>
        </div>

        {pressRelease ? (
          <div className="relative bg-slate-950 p-5 rounded-xl border border-slate-800">
            <button
              onClick={copyPressToClipboard}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Release'}</span>
            </button>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {pressRelease}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-dashed border-slate-800 text-slate-400 text-xs">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            Click "Generate Press Release" to draft a tailored marketing launch campaign for Qalgo (1,000 Trillion Network).
          </div>
        )}
      </div>
    </div>
  );
};
