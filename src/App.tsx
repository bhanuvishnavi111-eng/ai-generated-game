/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Music, Gamepad2, Volume2, Plus } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#00ffff] font-mono overflow-hidden relative selection:bg-[#ff00ff] selection:text-black">
      {/* CRT Overlay */}
      <div className="fixed inset-0 crt-lines pointer-events-none opacity-40 z-[1000]" />
      
      {/* Static Noise Placeholder */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
        <div className="w-[200%] h-[200%] bg-[url('https://media.giphy.com/media/oEI9uWUeez9ZK/giphy.gif')] animate-pulse" />
      </div>

      {/* Main Terminal Header */}
      <header className="h-20 flex items-center justify-between px-10 border-b-4 border-[#00ffff] bg-black/80 z-50 screen-tear">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-[#ff00ff] flex items-center justify-center p-2 shadow-[4px_4px_0px_#00ffff]">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter glitch" data-text="VOID_RUNNER_OS">
            VOID_RUNNER_v1.0.4
          </h1>
        </div>

        <div className="flex gap-12">
          <div className="text-right border-l-2 border-[#ff00ff] pl-6">
             <p className="text-[12px] opacity-60">SCORE_DATA</p>
             <p className="text-3xl text-[#ff00ff] flicker">{score.toString().padStart(6, '0')}</p>
          </div>
          <div className="text-right border-l-2 border-[#00ffff] pl-6">
             <p className="text-[12px] opacity-60 text-[#ff00ff]">PEAK_LOG</p>
             <p className="text-3xl">{highScore.toString().padStart(6, '0')}</p>
          </div>
        </div>
      </header>

      {/* Segmented Controller Body */}
      <main className="flex-1 flex gap-0 z-10 overflow-hidden bg-black">
        {/* Left Neural Link (Music) */}
        <aside className="w-80 border-r-4 border-[#00ffff] bg-black flex flex-col">
          <div className="p-4 bg-[#00ffff] text-black font-black uppercase italic tracking-widest text-xs">
            AUDIO_FEED_RECEPTOR
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
             <MusicPlayer variant="list" />
          </div>
          <div className="p-4 border-t-2 border-[#ff00ff] bg-black/40 text-[10px] uppercase leading-tight text-[#ff00ff]">
            SYSTEM_ADVISORY: AUDITORY_STIMULATION_REQUIRED_FOR_OPTIMAL_NEURAL_SINK.
          </div>
        </aside>

        {/* Center Void (Game) */}
        <section className="flex-1 flex flex-col relative bg-[#111] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full border-[10px] border-[#00ffff]/20 pointer-events-none" />
          
          <div className="flex-1 flex items-center justify-center relative scale-110">
             <SnakeGame onScoreChange={handleScoreChange} />
          </div>

          <div className="h-16 border-t-4 border-[#ff00ff] bg-black flex items-center justify-center gap-12 font-black text-sm uppercase italic">
             <span className="text-[#ff00ff] glitch">INPUT:WASD</span>
             <span className="opacity-40">::</span>
             <span className="text-[#00ffff] glitch">ACTION:HARVEST</span>
          </div>
        </section>

        {/* Right System Log */}
        <aside className="w-20 border-l-4 border-[#00ffff] bg-black flex flex-col items-center py-10 gap-10">
           {[Volume2, Gamepad2, Plus, Zap].map((Icon, i) => (
             <div key={i} className="w-12 h-12 border-2 border-[#00ffff] flex items-center justify-center hover:bg-[#ff00ff] hover:text-black transition-all cursor-pointer group">
                <Icon className="w-6 h-6 group-hover:scale-125 transition-transform" />
             </div>
           ))}
        </aside>
      </main>

      {/* Global Sync Footer */}
      <footer className="h-24 border-t-4 border-[#00ffff] bg-black z-50 flex items-center px-10">
         <MusicPlayer variant="footer" />
      </footer>
    </div>
  );
}

