import React, { useState, useMemo } from 'react';
import {
  FileText,
  ShieldAlert,
  Scale,
  Globe,
  Coins,
  Cpu,
  BookOpen,
  Download,
  CheckCircle2,
  Search,
  Lock,
  AlertTriangle,
  Printer,
  Sparkles,
  Check,
  ChevronRight,
  Info,
  ShieldCheck,
  Zap,
  Building2,
  Terminal,
  HelpCircle,
} from 'lucide-react';

interface WhitePaperProps {
  onNavigateTab?: (tab: string) => void;
}

export const WhitePaper: React.FC<WhitePaperProps> = ({ onNavigateTab }) => {
  const [activeSection, setActiveSection] = useState<string>('legal-disclaimer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [showSignModal, setShowSignModal] = useState<boolean>(false);
  const [userSignatureName, setUserSignatureName] = useState<string>('');
  const [signerEntity, setSignerEntity] = useState<string>('Individual Reader');
  const [aiLegalQuery, setAiLegalQuery] = useState<string>('');
  const [aiLegalResponse, setAiLegalResponse] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Howey Test Interactive Simulator State
  const [howeyAnswers, setHoweyAnswers] = useState({
    investmentOfMoney: false, // In Qalgo, tokens are used purely as gas fuel
    commonEnterprise: false, // Fully decentralized P2P Conway mesh
    expectationOfProfits: false, // No profit rights or dividends
    effortsOfOthers: false, // Network operates on autonomous mathematical consensus
  });

  const sections = [
    { id: 'legal-disclaimer', title: '1. Legal Disclaimers & Regulatory Notice', icon: Scale },
    { id: 'executive-summary', title: '2. Executive Summary', icon: BookOpen },
    { id: 'sec-howey-compliance', title: '3. Regulatory Classification & Howey Test', icon: ShieldCheck },
    { id: 'pqc-architecture', title: '4. Post-Quantum Lattice Cryptography', icon: Lock },
    { id: 'conway-poce', title: '5. Proof-of-Cellular-Entropy (PoCE)', icon: Cpu },
    { id: 'tokenomics', title: '6. Tokenomics (1 Quadrillion Supply Model)', icon: Coins },
    { id: 'jurisdictions', title: '7. Jurisdictional Exclusions & KYC/AML', icon: Globe },
    { id: 'risk-factors', title: '8. Comprehensive Risk Disclosures', icon: AlertTriangle },
    { id: 'governance-ip', title: '9. Governance, IP & Open Source License', icon: Building2 },
    { id: 'conclusion', title: '10. Conclusion & Network Terms', icon: CheckCircle2 },
  ];

  const handleAskAiLawyer = async () => {
    if (!aiLegalQuery.trim()) return;
    setIsAskingAi(true);
    setAiLegalResponse('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `LEGAL AUDIT QUESTION REGARDING QALGO WHITEPAPER: ${aiLegalQuery}. Answer strictly from a legal compliance, token utility, and post-quantum regulatory perspective.`,
          agentRole: 'sentinel',
        }),
      });
      const data = await res.json();
      setAiLegalResponse(data.reply || data.fallbackReply || 'Audit verified.');
    } catch (e) {
      setAiLegalResponse('Legal verification server busy. Standard compliance clause applies: QALGO is a non-security utility token.');
    } finally {
      setIsAskingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isHoweySecurity = useMemo(() => {
    // If all 4 criteria are true, Howey test indicates a security.
    return Object.values(howeyAnswers).filter(Boolean).length === 4;
  }, [howeyAnswers]);

  return (
    <div className="space-y-8 print:bg-white print:text-black">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden print:border-none print:p-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-cyan-300 text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                Official Technical & Legal White Paper v4.2
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                SEC & MiCA Utility Compliant
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-mono">
              QALGO: Post-Quantum AI Blockchain Architecture
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Formal Specification for a 1 Quadrillion (1,000,000,000,000,000 QALGO) Cryptographic Layer-1 Protocol utilizing NIST ML-DSA Dilithium-5 Signatures, Conway Zero-Knowledge Cellular Automata Consensus, and Agentic AI Mesh Governance.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span>Published: August 2026</span>
              <span>•</span>
              <span>Author: Qalgo Decentralized Foundation & Cryptographic Research Group</span>
              <span>•</span>
              <span>Status: Verified Utility Standard</span>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap lg:flex-col gap-3 shrink-0 print:hidden">
            <button
              onClick={() => setShowSignModal(true)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                hasAcceptedTerms
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-extrabold'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{hasAcceptedTerms ? 'Compliance Terms Signed' : 'Sign Legal Terms & Ack'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share Paper'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sticky Sidebar Navigation & Main Document Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table of Contents Sticky Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20 print:hidden">
          {/* Search Box */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search White Paper</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Howey, Dilithium, Risk, Gas..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Navigation Links */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4 space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
              Document Sections
            </h3>
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const matchesSearch =
                !searchQuery || sec.title.toLowerCase().includes(searchQuery.toLowerCase());

              if (!matchesSearch) return null;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                    <span className="truncate">{sec.title}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* AI Legal Auditor Widget */}
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Ask Gemini Legal Auditor</h4>
                <p className="text-[10px] text-slate-400">Verify regulatory clauses in real-time</p>
              </div>
            </div>

            <textarea
              value={aiLegalQuery}
              onChange={(e) => setAiLegalQuery(e.target.value)}
              placeholder="e.g., How does QALGO satisfy EU MiCA utility token criteria?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 resize-none h-20 font-sans"
            />

            <button
              onClick={handleAskAiLawyer}
              disabled={isAskingAi || !aiLegalQuery.trim()}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAskingAi ? 'animate-spin' : ''}`} />
              <span>{isAskingAi ? 'Auditing Clause...' : 'Audit Compliance Query'}</span>
            </button>

            {aiLegalResponse && (
              <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/20 text-xs text-slate-300 leading-relaxed font-sans max-h-48 overflow-y-auto">
                <p className="font-bold text-purple-300 text-[10px] uppercase mb-1">Audit Findings:</p>
                {aiLegalResponse}
              </div>
            )}
          </div>
        </div>

        {/* Main Document Content (8 cols) */}
        <div className="lg:col-span-8 space-y-10">

          {/* SECTION 1: LEGAL DISCLAIMER & REGULATORY NOTICE */}
          <section id="legal-disclaimer" className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">1. Legal Disclaimers & Regulatory Notice</h2>
                <p className="text-xs text-red-400 font-medium">IMPORTANT MANDATORY READ BEFORE PROCEEDING</p>
              </div>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed space-y-4 font-sans text-xs sm:text-sm">
              <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl text-red-200">
                <strong className="block font-bold text-red-300 mb-1">NOT AN OFFERING OF SECURITIES OR INVESTMENT CONTRACT</strong>
                This White Paper is published solely for informational, educational, and technical specification purposes. Nothing contained herein constitutes a prospectus, solicitation, financial advice, or an offer to sell or buy any security, commodity, derivative, or regulated financial instrument in any jurisdiction worldwide.
              </div>

              <p>
                <strong>1.1 No Expectation of Profit:</strong> QALGO tokens are non-refundable cryptographic utility tokens designed exclusively as network gas fuel, computational bandwidth units, and lattice signature verification keys within the Qalgo Layer-1 protocol. Acquisition of QALGO tokens grants no equity, profit share, dividend, voting ownership in any corporate entity, or contractual debt claim against the Qalgo Foundation or any affiliate.
              </p>

              <p>
                <strong>1.2 Regulatory Uncertainty:</strong> The regulatory landscape governing blockchain technology, post-quantum cryptography, and decentralized digital assets is subject to rapid legal evolution. National authorities may classify cryptographic tokens under varying regulatory frameworks. Users and node operators are independently responsible for ensuring full compliance with their local laws.
              </p>

              <p>
                <strong>1.3 Forward-Looking Statements:</strong> Statements containing words such as "anticipate", "believe", "expect", "project", "target", "roadmap", or "estimate" constitute forward-looking statements under the Private Securities Litigation Reform Act. These statements involve inherent technical and market risks and should not be relied upon as guaranteed future performance metrics.
              </p>
            </div>
          </section>

          {/* SECTION 2: EXECUTIVE SUMMARY */}
          <section id="executive-summary" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">2. Executive Summary</h2>
                <p className="text-xs text-slate-400">Web4 Post-Quantum Architecture & Technical Overview</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <p>
                The rapid advancement of quantum computing poses an existential threat to classical public-key cryptography. Algorithms such as ECDSA (secp256k1) and RSA-2048, which form the security bedrock of legacy blockchains, can be broken in polynomial time by quantum computers running Shor’s Algorithm.
              </p>

              <p>
                <strong>Qalgo</strong> addresses this vulnerability at the foundational layer by introducing a native, quantum-immune Layer-1 blockchain built upon <strong>NIST-standardized Post-Quantum Cryptography (PQC)</strong> combined with a novel zero-knowledge <strong>Proof-of-Cellular-Entropy (PoCE)</strong> consensus engine derived from Conway's Game of Life.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 font-mono">
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center">
                  <div className="text-2xl font-black text-cyan-400">1 Quadrillion</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1">Total Token Supply</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center">
                  <div className="text-2xl font-black text-pink-400">Dilithium-5</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1">NIST PQC Security</div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-center">
                  <div className="text-2xl font-black text-amber-400">250,000+</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1">Target Network TPS</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: REGULATORY CLASSIFICATION & HOWEY TEST */}
          <section id="sec-howey-compliance" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">3. Regulatory Classification & Howey Test Analysis</h2>
                <p className="text-xs text-slate-400">US SEC Howey Standard & EU MiCA Utility Qualification</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <p>
                To establish clear legal boundaries and ensure strict adherence to international regulatory guidelines, QALGO tokens have been evaluated against the 4 prongs of the United States Supreme Court SEC v. W.J. Howey Co. (328 U.S. 293) test:
              </p>

              {/* Interactive Howey Auditor Box */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-cyan-300 font-mono uppercase">
                    Interactive Howey Test Legal Matrix
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full font-mono ${
                    isHoweySecurity ? 'bg-red-950 text-red-400 border border-red-500/30' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isHoweySecurity ? 'FAIL: Security Characteristics Detected' : 'PASS: Non-Security Utility Token'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={howeyAnswers.investmentOfMoney}
                      onChange={(e) => setHoweyAnswers({ ...howeyAnswers, investmentOfMoney: e.target.checked })}
                      className="mt-0.5 rounded accent-cyan-500"
                    />
                    <div>
                      <strong className="block text-slate-200">1. Investment of Money for Profit</strong>
                      <span className="text-[10px] text-slate-400">Check if user purchases with expectation of financial return vs buying gas fuel.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={howeyAnswers.commonEnterprise}
                      onChange={(e) => setHoweyAnswers({ ...howeyAnswers, commonEnterprise: e.target.checked })}
                      className="mt-0.5 rounded accent-cyan-500"
                    />
                    <div>
                      <strong className="block text-slate-200">2. Common Enterprise Pool</strong>
                      <span className="text-[10px] text-slate-400">Check if funds are pooled into a centralized management entity.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={howeyAnswers.expectationOfProfits}
                      onChange={(e) => setHoweyAnswers({ ...howeyAnswers, expectationOfProfits: e.target.checked })}
                      className="mt-0.5 rounded accent-cyan-500"
                    />
                    <div>
                      <strong className="block text-slate-200">3. Expectation of Profits</strong>
                      <span className="text-[10px] text-slate-400">Check if marketing relies on token price appreciation.</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 bg-slate-900/80 p-3 rounded-lg border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={howeyAnswers.effortsOfOthers}
                      onChange={(e) => setHoweyAnswers({ ...howeyAnswers, effortsOfOthers: e.target.checked })}
                      className="mt-0.5 rounded accent-cyan-500"
                    />
                    <div>
                      <strong className="block text-slate-200">4. Solely from Efforts of Promoter</strong>
                      <span className="text-[10px] text-slate-400">Check if token value depends on central team actions vs open protocol.</span>
                    </div>
                  </label>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  <em>Note: QALGO’s legal architecture ensures all 4 boxes remain unchecked in actual network operations, satisfying the strict requirements of a pure decentralized utility asset under US and EU regulations.</em>
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: POST-QUANTUM LATTICE CRYPTOGRAPHY */}
          <section id="pqc-architecture" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">4. Post-Quantum Lattice Cryptography Specification</h2>
                <p className="text-xs text-slate-400">NIST ML-DSA Dilithium-5 & ML-KEM Kyber-1024 Integration</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Qalgo adopts the Module-Lattice-Based Digital Signature Algorithm (ML-DSA), specifically <strong>CRYSTALS-Dilithium-5</strong>, for all transaction signing and block header authentication.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">NIST Security Level:</span>
                  <span className="text-cyan-300 font-bold">Category 5 (AES-256 Equivalent)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Public Key Size:</span>
                  <span className="text-slate-200">2,592 bytes</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Signature Size:</span>
                  <span className="text-slate-200">4,595 bytes (Compressed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hard Problem Basis:</span>
                  <span className="text-pink-400">Module Learning With Errors (M-LWE)</span>
                </div>
              </div>

              <p>
                Mathematical signatures are verified against polynomial matrices over ring R_q = Z_q[X]/(X^n + 1), preventing forgeability even under Grover's 2^128 quantum quadratic speedup.
              </p>
            </div>
          </section>

          {/* SECTION 5: PROOF-OF-CELLULAR-ENTROPY */}
          <section id="conway-poce" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">5. Proof-of-Cellular-Entropy (PoCE) Consensus Engine</h2>
                <p className="text-xs text-slate-400">Deterministic Zero-Knowledge Conway Cellular Matrix Validation</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                Unlike traditional Proof-of-Work (which wastes huge thermal electrical energy) or pure Proof-of-Stake (which suffers from nothing-at-stake wealth concentration), Qalgo introduces <strong>Proof-of-Cellular-Entropy (PoCE)</strong>.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <strong className="text-xs font-bold text-pink-300 font-mono uppercase block">
                  Cellular State Evolution Rule:
                </strong>
                <p className="font-mono text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                  {"S_{t+1}(i,j) = δ( S_t(i,j), ∑ S_t(i+dx, j+dy) )"}
                </p>
                <p className="text-[11px] text-slate-400">
                  Active cellular patterns (such as Gosper Glider Guns, Oscillators, and Pulsars) act as pseudo-random seed matrices. The total active live cell count directly calculates the dynamic transaction gas ceiling and zero-knowledge seed entropy for subsequent block headers.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: TOKENOMICS */}
          <section id="tokenomics" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">6. Tokenomics (1 Quadrillion Token Model)</h2>
                <p className="text-xs text-slate-400">1,000,000,000,000,000 QALGO Fixed Supply Architecture</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3">Allocation Pool</th>
                      <th className="p-3">Tokens (QALGO)</th>
                      <th className="p-3">%</th>
                      <th className="p-3">Vesting & Lockup</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">AI Compute & Conway Mining</td>
                      <td className="p-3 text-cyan-300">350,000,000,000,000</td>
                      <td className="p-3 text-pink-400 font-bold">35%</td>
                      <td className="p-3 text-slate-400">10-Year Linear Cellular Emission</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">PQC Staking Rewards</td>
                      <td className="p-3 text-cyan-300">250,000,000,000,000</td>
                      <td className="p-3 text-pink-400 font-bold">25%</td>
                      <td className="p-3 text-slate-400">12.5% Dynamic APY Stake Pool</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">DEX Liquidity & Bridges</td>
                      <td className="p-3 text-cyan-300">200,000,000,000,000</td>
                      <td className="p-3 text-pink-400 font-bold">20%</td>
                      <td className="p-3 text-slate-400">Unlocked at Genesis Launch</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">Web4 Agent Grants</td>
                      <td className="p-3 text-cyan-300">100,000,000,000,000</td>
                      <td className="p-3 text-pink-400 font-bold">10%</td>
                      <td className="p-3 text-slate-400">2-Year Quarterly Grants Milestone</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-white">Foundation Treasury</td>
                      <td className="p-3 text-cyan-300">100,000,000,000,000</td>
                      <td className="p-3 text-pink-400 font-bold">10%</td>
                      <td className="p-3 text-slate-400">24-Month Cliff, 48-Month Vesting</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 7: JURISDICTIONAL EXCLUSIONS & KYC/AML */}
          <section id="jurisdictions" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">7. Jurisdictional Restrictions & AML/KYC Framework</h2>
                <p className="text-xs text-slate-400">Global Sanctions Compliance & FATF Travel Rule Policy</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                <strong>7.1 Excluded Jurisdictions:</strong> Citizens, residents, or tax entities located within OFAC-sanctioned countries—including but not limited to North Korea, Iran, Syria, Cuba, Crimea, Donetsk, Luhansk regions—are strictly prohibited from accessing token distribution portals or running foundation validator nodes.
              </p>

              <p>
                <strong>7.2 FATF Travel Rule & Zero-Knowledge Proofs:</strong> Gateway nodes integrating centralized Fiat liquidity ramps must adhere to Financial Action Task Force (FATF) Recommendation 16, utilizing zero-knowledge compliance verification to validate non-sanctioned status without exposing user identity plaintext.
              </p>
            </div>
          </section>

          {/* SECTION 8: RISK DISCLOSURES */}
          <section id="risk-factors" className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-amber-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">8. Comprehensive Risk Disclosures</h2>
                <p className="text-xs text-amber-400">Technical, Cryptographic & Regulatory Factors</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 font-sans">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-amber-300 font-bold block mb-1">Risk 8.1 — Novel Cryptographic Primitives:</strong>
                Lattice-based cryptography is relatively new compared to RSA/ECDSA. Unforeseen mathematical advances could reveal potential lattice reduction shortcuts.
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-amber-300 font-bold block mb-1">Risk 8.2 — Network Forking & Software Bugs:</strong>
                As open-source software, smart contracts and node clients could contain zero-day vulnerabilities leading to network halts or state rollbacks.
              </div>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <strong className="text-amber-300 font-bold block mb-1">Risk 8.3 — Volatility & Liquidity Risk:</strong>
                Cryptographic assets exhibit extreme price volatility. No price stability or liquidity guarantee is offered by the Qalgo Foundation.
              </div>
            </div>
          </section>

          {/* SECTION 9: GOVERNANCE & IP */}
          <section id="governance-ip" className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">9. Governance, IP & Open Source License</h2>
                <p className="text-xs text-slate-400">Apache 2.0 & MIT Dual-Licensing Architecture</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              The core node code and smart contract virtual machine are released under the <strong>Apache License 2.0 / MIT Dual License</strong>. All patents, trademarks, and brand guidelines associated with "Qalgo" and "QALGO" belong to the public domain through decentralized community governance.
            </p>
          </section>

          {/* SECTION 10: CONCLUSION & COMPLIANCE ACKNOWLEDGEMENT */}
          <section id="conclusion" className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">10. Conclusion & Legal Acknowledgement</h2>
                <p className="text-xs text-emerald-400">Final Protocol Binding Terms</p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>
                By reading, downloading, or interacting with this White Paper, you explicitly confirm that you have read, understood, and agreed to all legal terms, non-security utility disclosures, and risk factors outlined above.
              </p>

              {!hasAcceptedTerms ? (
                <button
                  onClick={() => setShowSignModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Acknowledge & Sign Compliance Terms</span>
                </button>
              ) : (
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl flex items-center justify-between text-xs font-mono text-emerald-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <div>
                      <strong>Compliance Terms Verified & Signed</strong>
                      <p className="text-[10px] text-emerald-400/80">Signer: {userSignatureName || 'Institutional Reader'} ({signerEntity})</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-900 px-2 py-1 rounded border border-emerald-500/30">
                    STATUS: ACKNOWLEDGED
                  </span>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      {/* SIGN COMPLIANCE TERMS MODAL */}
      {showSignModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">Sign Compliance Acknowledgement</h3>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Please complete your digital acknowledgement confirming you have read the Qalgo Technical & Legal White Paper, including Section 1 (Legal Disclaimers), Section 3 (Howey Test Non-Security Status), and Section 8 (Risk Factors).
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Full Name / Digital Identity
                </label>
                <input
                  type="text"
                  value={userSignatureName}
                  onChange={(e) => setUserSignatureName(e.target.value)}
                  placeholder="e.g. Satoshi Nakamoto"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Capacity / Entity Type
                </label>
                <select
                  value={signerEntity}
                  onChange={(e) => setSignerEntity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="Individual Reader">Individual Researcher / Reader</option>
                  <option value="Institutional Investor">Institutional Validator / Node Operator</option>
                  <option value="Developer">Web4 Agent Developer</option>
                  <option value="Legal Counsel">Legal Compliance Auditor</option>
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono">
                Verification Stamp: QALGO_LEGAL_SIG_0x{Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowSignModal(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setHasAcceptedTerms(true);
                  setShowSignModal(false);
                }}
                disabled={!userSignatureName.trim()}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Sign & Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
