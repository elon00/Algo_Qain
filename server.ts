import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with recommended headers
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "placeholder_key",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", network: "Qalgo-Web4-Quantum-Mainnet", totalTokens: "1,000,000,000,000,000 QALGO" });
});

// API: Agentic Chatbot powered by Gemini
app.post("/api/chat", async (req, res) => {
  try {
    const { message, agentRole = "sentinel", history = [] } = req.body;
    
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required." });
    }

    const ai = getGenAI();

    let systemInstruction = "";
    if (agentRole === "sentinel") {
      systemInstruction = `You are Qalgo Sentinel, the Quantum Security Auditor for Qalgo Blockchain (1 Quadrillion QALGO Supply).
You specialize in Post-Quantum Cryptography (PQC), CRYSTALS-Dilithium digital signatures, lattice-based cryptography, Falcon-1024 signatures, and auditing smart contracts against quantum threat vectors (Grover & Shor algorithms).
Provide technical, authoritative, and helpful post-quantum security advice. Keep responses clear, professional, and well-structured.`;
    } else if (agentRole === "conway") {
      systemInstruction = `You are Conway Automaton AI, the cellular automata state engine for Qalgo Blockchain.
You evaluate Conway's Game of Life grid dynamics, spatial entropy generation, deterministic zero-knowledge block seed synthesis, and micro-gas optimization.
Explain how cellular patterns (e.g. Gosper Glider Gun, Pulsars, Spaceships) translate into block validation hashes and autonomous smart contract state transitions.`;
    } else {
      systemInstruction = `You are Qalgo Web4 Oracle, the tokenomics architect and Web4 autonomous node strategist.
You govern the global launch parameters of Qalgo (1,000 Trillion / 1 Quadrillion Total Token Supply), decentralized peer-to-peer AI mesh networks, staking rewards, and global marketing standards.
Assist users with smart contract ideas, Web4 domain resolution (.qalgo), staking yields, and market positioning strategies.`;
    }

    // Format chat history if provided
    const promptText = `User query: ${message}\nContext: The network total supply is 1,000,000,000,000,000 QALGO with 250,000 PQC TPS.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || "Qalgo Autonomous Node processed the request.",
      agentRole,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "AI Agent response failed.",
      details: error.message || String(error),
      fallbackReply: "Qalgo Agent offline due to key/network state. Re-routing through PQC backup node...",
    });
  }
});

// API: Generate PQC Keypair & Signature simulation
app.post("/api/pqc/generate", (req, res) => {
  const { algorithm = "CRYSTALS-Dilithium-5" } = req.body;
  
  const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const pubKey = `pqc_pk_${algorithm.toLowerCase().replace(/-/g, '_')}_${randomHex(48)}`;
  const privKey = `pqc_sk_enc_${randomHex(64)}`;
  const walletAddr = `QALGO1Q${randomHex(36).toUpperCase()}`;

  res.json({
    algorithm,
    publicKey: pubKey,
    privateKey: privKey,
    walletAddress: walletAddr,
    quantumSecurityBits: algorithm.includes("Dilithium-5") ? 256 : 192,
    latticeDimension: 8,
    status: "QUANTUM_RESISTANT_VERIFIED",
    timestamp: Date.now()
  });
});

// API: Generate Marketing Press Release with Gemini
app.post("/api/marketing/generate-press", async (req, res) => {
  try {
    const { targetAudience = "Global Web3 & Institutional Investors", customMessage = "" } = req.body;
    const ai = getGenAI();

    const prompt = `Write a top-tier, high-impact global press release for the official mainnet deployment of Qalgo (Quantum Algorithmic Network) featuring:
- Total Crypto Currency Supply: 1,000 Trillion (1 Quadrillion QALGO)
- Features: Post-Quantum Cryptography (PQC Dilithium-5), Conway AI Cellular Automaton zero-knowledge seed engine, Web4 Peer-to-Peer AI Mesh, and Agentic AI Oracles.
- Audience: ${targetAudience}
- Additional notes: ${customMessage}

Format with clear Headline, Subheadline, Executive Summary, Key Pillars, and Call to Action.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the Chief Communications Officer for Qalgo Blockchain, drafting global enterprise announcements.",
        temperature: 0.8,
      },
    });

    res.json({
      pressRelease: response.text,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Press Release generation failed",
      pressRelease: `# OFFICIAL ANNOUNCEMENT: QALGO MAINNET LAUNCH (1,000 TRILLION QALGO)

**GENESIS BLOCK MINED WITH POST-QUANTUM DILITHIUM-5 SECURITY & CONWAY AI AUTOMATON**

Qalgo Foundation is proud to announce the immediate global deployment of the Qalgo Web4 Blockchain Architecture. Built with a total supply of 1,000,000,000,000,000 QALGO tokens, the network combines lattice-based post-quantum cryptography (PQC) with live Conway cellular automata entropy generation.

### Key Network Highlights
- **1 Quadrillion Total Supply**: Scaled for hyper-micro transactions, AI compute streaming, and worldwide node incentives.
- **Quantum Immune**: Protected against quantum decryption with CRYSTALS-Dilithium-5 & Kyber-1024 signatures.
- **Conway Automaton Engine**: Zero-knowledge entropy synthesized directly from cellular growth patterns.
- **Web4 AI Mesh**: Autonomous agentic chatbots act as on-chain auditors, validators, and contract builders.`,
    });
  }
});

// Start Express server and Vite setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QAIN Blockchain Node & Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
