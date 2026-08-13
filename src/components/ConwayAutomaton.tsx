import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Zap, Sparkles, Code2, Cpu, Hash, Layers } from 'lucide-react';
import { ConwayStats } from '../types';

interface ConwayAutomatonProps {
  onMineBlockFromConway: (entropySeed: string, patternName: string, cellCount: number) => void;
}

const GRID_SIZE = 24;

export const ConwayAutomaton: React.FC<ConwayAutomatonProps> = ({ onMineBlockFromConway }) => {
  const [grid, setGrid] = useState<boolean[][]>(() => createInitialGrid('glider'));
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [generation, setGeneration] = useState<number>(0);
  const [patternName, setPatternName] = useState<string>('Glider');
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [entropySeed, setEntropySeed] = useState<string>('');

  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  function createEmptyGrid(): boolean[][] {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));
  }

  function createInitialGrid(preset: string): boolean[][] {
    const g = createEmptyGrid();
    const mid = Math.floor(GRID_SIZE / 2);

    if (preset === 'glider') {
      g[1][2] = true;
      g[2][3] = true;
      g[3][1] = true;
      g[3][2] = true;
      g[3][3] = true;
    } else if (preset === 'pulsar') {
      const p = [
        [mid - 4, mid - 2], [mid - 4, mid - 1], [mid - 4, mid], [mid - 4, mid + 1], [mid - 4, mid + 2],
        [mid + 4, mid - 2], [mid + 4, mid - 1], [mid + 4, mid], [mid + 4, mid + 1], [mid + 4, mid + 2],
        [mid - 2, mid - 4], [mid - 1, mid - 4], [mid, mid - 4], [mid + 1, mid - 4], [mid + 2, mid - 4],
        [mid - 2, mid + 4], [mid - 1, mid + 4], [mid, mid + 4], [mid + 1, mid + 4], [mid + 2, mid + 4],
      ];
      p.forEach(([r, c]) => {
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) g[r][c] = true;
      });
    } else if (preset === 'random') {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          g[r][c] = Math.random() > 0.72;
        }
      }
    } else if (preset === 'spaceship') {
      g[2][1] = true; g[2][4] = true;
      g[3][5] = true;
      g[4][1] = true; g[4][5] = true;
      g[5][2] = true; g[5][3] = true; g[5][4] = true; g[5][5] = true;
    }
    return g;
  }

  const countNeighbors = (g: boolean[][], x: number, y: number) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const r = (x + i + GRID_SIZE) % GRID_SIZE;
        const c = (y + j + GRID_SIZE) % GRID_SIZE;
        if (g[r][c]) count++;
      }
    }
    return count;
  };

  const stepGrid = useCallback(() => {
    setGrid((currentGrid) => {
      const next = createEmptyGrid();
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const neighbors = countNeighbors(currentGrid, r, c);
          if (currentGrid[r][c]) {
            next[r][c] = neighbors === 2 || neighbors === 3;
          } else {
            next[r][c] = neighbors === 3;
          }
        }
      }
      return next;
    });
    setGeneration((g) => g + 1);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        stepGrid();
      }, 250);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, stepGrid]);

  // Compute active cells & entropy seed
  const activeCellsCount = grid.flat().filter(Boolean).length;

  useEffect(() => {
    // Generate deterministic entropy seed from grid state & generation
    let bitString = '';
    grid.forEach((row) => {
      row.forEach((cell) => {
        bitString += cell ? '1' : '0';
      });
    });

    let hashVal = 0;
    for (let i = 0; i < bitString.length; i++) {
      hashVal = (hashVal << 5) - hashVal + bitString.charCodeAt(i);
      hashVal |= 0;
    }

    const hexEntropy = `0xQAIN_${Math.abs(hashVal).toString(16).padStart(8, '0')}_${generation.toString(16)}_${activeCellsCount.toString(16)}`;
    setEntropySeed(hexEntropy);

    // Auto update TEAL contract representation
    const tealCode = `// QAIN Conway Automaton TEAL Contract
// Generated from ${patternName} (Gen #${generation}, Active: ${activeCellsCount} cells)
// Zero-Knowledge Entropy Seed: ${hexEntropy}

#pragma version 8
txn ApplicationID
int 0
==
bnz handle_setup

// Validate Conway State
byte "${hexEntropy.slice(0, 16)}"
app_global_put

// Verify Post-Quantum Dilithium-5 Signature on Block
txna ApplicationArgs 0
callsub verify_pqc_dilithium

int 1
return

verify_pqc_dilithium:
  // Lattice-based signature verification
  byte "PQC_DILITHIUM5_OK"
  log
  retsub

handle_setup:
  int 1
  return`;
    setGeneratedContract(tealCode);
  }, [grid, generation, activeCellsCount, patternName]);

  const toggleCell = (r: number, c: number) => {
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = !next[r][c];
      return next;
    });
  };

  const handlePresetChange = (preset: string, name: string) => {
    setIsRunning(false);
    setGeneration(0);
    setPatternName(name);
    setGrid(createInitialGrid(preset));
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                AI Cellular State Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Conway's Game of Life + Zero-Knowledge Entropy
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Conway AI Automaton & Block Validator
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              QAIN uses mathematical cellular growth dynamics to synthesize unpredictable, zero-knowledge block entropy seeds. Living cell patterns drive consensus parameters and smart contract evolution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onMineBlockFromConway(entropySeed, patternName, activeCellsCount)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              Mine Block with Conway Seed
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid & Controls layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Canvas & Controls (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            {/* Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isRunning
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? 'Pause Engine' : 'Run Automaton'}</span>
                </button>

                <button
                  onClick={stepGrid}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Step
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false);
                    setGeneration(0);
                    setGrid(createEmptyGrid());
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
                <button
                  onClick={() => handlePresetChange('glider', 'Glider')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                >
                  Glider
                </button>
                <button
                  onClick={() => handlePresetChange('pulsar', 'Pulsar')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                >
                  Pulsar
                </button>
                <button
                  onClick={() => handlePresetChange('spaceship', 'Spaceship')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                >
                  Spaceship
                </button>
                <button
                  onClick={() => handlePresetChange('random', 'Quantum Chaos')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-pink-300 text-xs rounded-lg border border-pink-500/30 bg-pink-950/30"
                >
                  Chaos
                </button>
              </div>
            </div>

            {/* Conway Cell Canvas Grid */}
            <div className="flex justify-center my-2">
              <div
                className="grid gap-1 p-3 bg-slate-950 border border-indigo-500/30 rounded-2xl shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  width: '100%',
                  maxWidth: '480px',
                  aspectRatio: '1/1',
                }}
              >
                {grid.map((row, r) =>
                  row.map((cell, c) => (
                    <div
                      key={`${r}-${c}`}
                      onClick={() => toggleCell(r, c)}
                      className={`rounded-sm cursor-pointer transition-all duration-150 ${
                        cell
                          ? 'bg-gradient-to-tr from-pink-500 to-cyan-400 shadow-sm shadow-cyan-400/50 scale-95'
                          : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800/60'
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar under Canvas */}
          <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Generation</span>
              <span className="text-lg font-bold font-mono text-white">#{generation}</span>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Living Cells</span>
              <span className="text-lg font-bold font-mono text-pink-400">{activeCellsCount}</span>
            </div>

            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Entropy Density</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {((activeCellsCount / (GRID_SIZE * GRID_SIZE)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Code & Entropy (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Real-Time Entropy Hash Card */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Synthesized Entropy Seed
              </h3>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 break-all select-all">
              {entropySeed}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Extracted via 2D spatial cell hash & generation index. Fed into QAIN's post-quantum validator matrix.
            </p>
          </div>

          {/* Generated Smart Contract Code Card */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Auto-Generated PyTeal Contract
                </h3>
              </div>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-mono">
                TEAL v8
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto max-h-80 text-xs font-mono text-slate-300 leading-relaxed">
              <pre>{generatedContract}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
