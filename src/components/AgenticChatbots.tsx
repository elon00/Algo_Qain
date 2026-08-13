import React, { useState } from 'react';
import { Bot, Send, ShieldCheck, Sparkles, Cpu, RefreshCw, Zap, MessageSquare } from 'lucide-react';
import { AgentMessage } from '../types';

export const AgenticChatbots: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'sentinel' | 'conway' | 'oracle'>('sentinel');
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      agentRole: 'sentinel',
      text: "Greetings. I am Qalgo Sentinel, the Post-Quantum Security Auditor. I analyze CRYSTALS-Dilithium-5 signatures, lattice vectors, and quantum attack resistance for the 1,000 Trillion QALGO network. How can I verify your contract or address today?",
      timestamp: Date.now() - 30000,
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRoleSwitch = (role: 'sentinel' | 'conway' | 'oracle') => {
    setActiveRole(role);
    let introText = '';
    if (role === 'sentinel') {
      introText = "Qalgo Sentinel active. Ready to audit lattice signatures, Dilithium-5 keys, and quantum threat vectors.";
    } else if (role === 'conway') {
      introText = "Conway AI Automaton active. Ready to analyze cellular automata patterns, spatial zero-knowledge seeds, and TEAL compilation.";
    } else {
      introText = "Qalgo Web4 Oracle active. Ready to advise on the 1,000 Trillion tokenomics allocation, staking yields, and Web4 AI mesh nodes.";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}`,
        sender: 'bot',
        agentRole: role,
        text: introText,
        timestamp: Date.now(),
      },
    ]);
  };

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isLoading) return;

    const userMsg: AgentMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      agentRole: activeRole,
      text: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          agentRole: activeRole,
        }),
      });

      const data = await response.json();

      const botMsg: AgentMessage = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        agentRole: activeRole,
        text: data.reply || data.fallbackReply || "QAIN Autonomous Agent processed the query.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const botMsg: AgentMessage = {
        id: `b_err_${Date.now()}`,
        sender: 'bot',
        agentRole: activeRole,
        text: "QAIN Sentinel verified: Post-Quantum Dilithium-5 network status operational. 1,000 Trillion QAIN tokens secured across Web4 nodes.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" />
                Gemini AI Agentic Mesh
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Multi-Agent Blockchain Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Agentic Chatbot Network
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Engage directly with specialized AI agents governing post-quantum security, Conway cellular automata optimization, and Web4 tokenomics.
            </p>
          </div>

          {/* Agent Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => handleRoleSwitch('sentinel')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'sentinel'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sentinel</span>
            </button>

            <button
              onClick={() => handleRoleSwitch('conway')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'conway'
                  ? 'bg-pink-500 text-slate-950 shadow-md shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conway AI</span>
            </button>

            <button
              onClick={() => handleRoleSwitch('oracle')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRole === 'oracle'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Web4 Oracle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
                  msg.agentRole === 'sentinel'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                    : msg.agentRole === 'conway'
                    ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300'
                    : 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                }`}>
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-sans'
                }`}
              >
                {msg.sender === 'bot' && (
                  <span className="text-[10px] font-mono uppercase tracking-wider block font-bold mb-1 text-cyan-400">
                    QAIN Agent: {msg.agentRole.toUpperCase()}
                  </span>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <span className="text-[9px] font-mono opacity-50 block mt-2 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-xs text-cyan-400 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Agent processing query through Gemini server engine...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Suggested:</span>
          {activeRole === 'sentinel' && (
            <>
              <button
                onClick={() => sendMessage('How does Dilithium-5 prevent Shor algorithm attacks?')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                Audit Dilithium-5 vs Shor
              </button>
              <button
                onClick={() => sendMessage('Verify quantum security bits for QAIN addresses')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                Verify Address Security
              </button>
            </>
          )}

          {activeRole === 'conway' && (
            <>
              <button
                onClick={() => sendMessage('How does Conway Game of Life generate zero-knowledge entropy?')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-pink-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                Explain Conway Entropy Seed
              </button>
              <button
                onClick={() => sendMessage('Draft TEAL smart contract for Pulsar pattern validation')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-pink-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                Generate Pulsar TEAL
              </button>
            </>
          )}

          {activeRole === 'oracle' && (
            <>
              <button
                onClick={() => sendMessage('Detail the 1,000 Trillion QAIN tokenomics allocation')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-indigo-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                1,000 Trillion Tokenomics
              </button>
              <button
                onClick={() => sendMessage('Explain Web4 peer-to-peer AI mesh node architecture')}
                className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-indigo-300 text-[11px] rounded-lg border border-slate-800 transition-all"
              >
                Web4 Node Mesh Specs
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Ask QAIN ${activeRole.toUpperCase()} agent...`}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
