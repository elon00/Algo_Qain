export interface Block {
  index: number;
  hash: string;
  previousHash: string;
  timestamp: number;
  nonce: number;
  entropySeed: string; // From Conway AI pattern
  transactionsCount: number;
  pqcSignature: string;
  algorithm: 'Dilithium-5' | 'Falcon-1024' | 'Sphincs+';
  gasUsed: number;
  conwayPatternName: string;
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  fee: number;
  timestamp: number;
  status: 'confirmed' | 'pending' | 'quantum_verifying';
  signature: string;
  type: 'transfer' | 'stake' | 'conway_mint' | 'smart_contract_call' | 'pqc_faucet';
}

export interface PQCKeyPair {
  publicKey: string;
  privateKey: string;
  algorithm: 'CRYSTALS-Dilithium-5' | 'CRYSTALS-Kyber-1024' | 'Falcon-1024';
  quantumSecurityBits: number;
  walletAddress: string;
}

export interface ConwayStats {
  generation: number;
  activeCells: number;
  entropyScore: number;
  suggestedBlockGas: number;
  patternType: string;
}

export interface TokenomicsAllocation {
  category: string;
  amount: number; // in QAIN
  percentage: number;
  description: string;
  color: string;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'bot';
  agentRole: 'sentinel' | 'conway' | 'oracle';
  text: string;
  timestamp: number;
  suggestedAction?: {
    label: string;
    actionType: string;
    payload?: any;
  };
}

export interface MarketingPressKit {
  title: string;
  subtitle: string;
  highlights: string[];
  pressRelease: string;
  globalSlogan: string;
  targetMetrics: {
    tps: string;
    pqcBits: string;
    totalSupply: string;
    nodeIncentives: string;
  };
}
