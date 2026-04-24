/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, AudioLines } from 'lucide-react';
import { motion } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  color: string;
  gradient?: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Composer Beta',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    color: '#22d3ee',
    gradient: 'from-cyan-600 to-slate-900'
  },
  {
    id: '2',
    title: 'Synth Wave Dreams',
    artist: 'Cyber Rhythm Engine',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    color: '#d946ef',
    gradient: 'from-fuchsia-800 to-slate-900'
  },
  {
    id: '3',
    title: 'Cybernetic Echo',
    artist: 'Neural Soundscape',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    color: '#f59e0b',
    gradient: 'from-amber-600 to-slate-900'
  }
];

interface MusicPlayerProps {
  variant?: 'list' | 'footer';
}

export function MusicPlayer({ variant = 'list' }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNext}
        />
        {TRACKS.map((track, idx) => {
          const isActive = idx === currentTrackIndex;
          return (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`p-4 border-2 flex gap-4 items-center cursor-pointer transition-all ${
                isActive ? 'bg-[#00ffff] text-black border-[#ff00ff]' : 'hover:bg-[#ff00ff] hover:text-black border-[#00ffff]/40 border-dashed'
              }`}
            >
              <div className="text-xl font-black">0{idx + 1}</div>
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-black leading-none truncate uppercase italic ${isActive ? 'glitch' : ''}`}>{track.title}</p>
                <p className="text-[10px] opacity-60 truncate uppercase tracking-widest leading-none mt-1">{track.artist}</p>
              </div>
              {isActive && isPlaying && (
                <div className="w-4 h-4 bg-black animate-ping" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Footer Variant - Raw Brutalist
  return (
    <div className="flex-1 flex items-center gap-10 h-full">
      <div className="flex items-center gap-6 w-72 h-full border-r-2 border-[#00ffff]/20 pr-10">
        <div className={`w-16 h-16 bg-[#ff00ff] border-2 border-[#00ffff] flex-shrink-0 flex items-center justify-center p-1 overflow-hidden relative`}>
           <div className="w-full h-full bg-black flex items-center justify-center">
              <AudioLines className="w-8 h-8 text-[#00ffff] animate-pulse" />
           </div>
        </div>
        <div className="min-w-0">
          <h4 className="text-2xl font-black text-[#00ffff] leading-none uppercase truncate italic">{currentTrack.title}</h4>
          <p className="text-[10px] text-[#ff00ff] uppercase tracking-[0.3em] font-bold mt-1">STATUS: STREAMING...</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-12">
          <button onClick={handlePrev} className="text-[#00ffff] hover:text-[#ff00ff] p-2 hover:scale-125 transition-transform active:translate-x-[-4px]">
            <SkipBack className="w-8 h-8" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-[#00ffff] border-2 border-[#ff00ff] text-black flex items-center justify-center hover:bg-[#ff00ff] transition-colors shadow-[4px_4px_0px_#00ffff]"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
          <button onClick={handleNext} className="text-[#00ffff] hover:text-[#ff00ff] p-2 hover:scale-125 transition-transform active:translate-x-[4px]">
            <SkipForward className="w-8 h-8" />
          </button>
        </div>
        <div className="w-full flex items-center gap-6">
          <span className="text-[12px] font-mono opacity-60">
            {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : '0'}:{audioRef.current ? Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : '00'}
          </span>
          <div className="flex-1 h-3 bg-black border-2 border-[#00ffff]/40 relative overflow-hidden cursor-pointer" 
               onClick={(e) => {
                 if (audioRef.current) {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const percent = (e.clientX - rect.left) / rect.width;
                   audioRef.current.currentTime = percent * audioRef.current.duration;
                 }
               }}>
            <motion.div 
              className="absolute left-0 top-0 h-full bg-[#ff00ff]"
              style={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            />
          </div>
          <span className="text-[12px] font-mono opacity-60">
            {audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) : '0'}:{audioRef.current && !isNaN(audioRef.current.duration) ? Math.floor(audioRef.current.duration % 60).toString().padStart(2, '0') : '00'}
          </span>
        </div>
      </div>

      <div className="w-72 flex justify-end items-center gap-6 text-[#00ffff] border-l-2 border-[#00ffff]/20 pl-10 h-full">
        <Volume2 className="w-6 h-6" />
        <div className="w-24 h-4 bg-black border-2 border-[#00ffff] flex items-center px-1">
          <div className="w-3/4 h-1 bg-[#ff00ff]" />
        </div>
      </div>
    </div>
  );
}

