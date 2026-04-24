/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const GAME_SPEED = 120;

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(p => p.x === newHead.x && p.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
        
        if (newScore % 100 === 0) {
           confetti({
             particleCount: 150,
             spread: 120,
             origin: { y: 0.6 },
             colors: ['#00ffff', '#ff00ff', '#ffffff']
           });
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, onScoreChange, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': case 's': case 'S': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': case 'a': case 'A': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': case 'd': case 'D': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
    setFood({ x: 5, y: 5 });
  };

  return (
    <div className="relative w-full max-w-[600px] aspect-square border-[8px] border-[#00ffff] bg-black overflow-hidden shadow-[0_0_50px_#00ffff44]">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#00ffff 1px, transparent 1px), linear-gradient(90deg, #00ffff 1px, transparent 1px)', 
             backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%` 
           }} 
      />

      {/* Snake & Food */}
      <div className="relative w-full h-full p-1">
        {/* Food */}
        <motion.div 
          className="absolute bg-[#ff00ff] shadow-[0_0_20px_#ff00ff]"
          style={{ 
            width: `${100/GRID_SIZE}%`, 
            height: `${100/GRID_SIZE}%`, 
            left: `${(food.x / GRID_SIZE) * 100}%`, 
            top: `${(food.y / GRID_SIZE) * 100}%`,
          }}
          animate={{ opacity: [1, 0, 1], scale: [1, 1.5, 1] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />

        {/* Snake Body */}
        {snake.map((segment, i) => (
          <div 
            key={i} 
            className="absolute border border-black"
            style={{ 
              width: `${100/GRID_SIZE}%`, 
              height: `${100/GRID_SIZE}%`, 
              left: `${(segment.x / GRID_SIZE) * 100}%`, 
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              background: i === 0 ? '#00ffff' : i % 2 === 0 ? '#00ffff' : '#ff00ff',
              boxShadow: i === 0 ? '0 0 20px #00ffff' : 'none',
              zIndex: snake.length - i
            }}
          />
        ))}
      </div>

      {/* Overlays */}
      <AnimatePresence>
        {(isGameOver || isPaused) && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 text-center px-10 screen-tear"
          >
            {isGameOver ? (
              <div className="space-y-10">
                <h2 className="text-8xl font-black italic tracking-tighter uppercase text-[#ff00ff] glitch" data-text="SYSTEM_FAILURE">
                  SIGNAL_LOST
                </h2>
                <div className="flex flex-col items-center gap-2 border-y-4 border-[#00ffff] py-6 bg-[#00ffff]/10">
                   <span className="text-xs uppercase opacity-60 tracking-[0.5em] font-bold">BIT_HARVEST_FINAL</span>
                   <span className="text-7xl font-black text-[#00ffff]">{score.toString().padStart(6, '0')}</span>
                </div>
                <button 
                  onClick={resetGame}
                  className="px-12 py-4 bg-[#00ffff] text-black font-black uppercase italic tracking-[0.2em] text-2xl hover:bg-[#ff00ff] hover:text-white transition-all shadow-[6px_6px_0px_white] active:translate-y-1 active:shadow-none"
                >
                  REBOOT_CORE
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                 <h2 className="text-7xl font-black italic tracking-tighter uppercase text-[#00ffff] glitch" data-text="AWAITING_SYNAPE">
                   VOID_LINK_v1
                 </h2>
                 <p className="text-lg text-[#ff00ff] max-w-sm leading-none font-bold uppercase italic border-l-4 border-[#ff00ff] pl-6 py-2">
                   NEURAL_DECAY_PREVENTED. <br/>AWAITING_USER_INPUT_SEQUENCE.
                 </p>
                 <button 
                  onClick={() => setIsPaused(false)}
                  className="px-12 py-4 bg-[#ff00ff] text-black font-black uppercase italic tracking-[0.2em] text-2xl hover:bg-[#00ffff] transition-all shadow-[6px_6px_0px_#00ffff] active:translate-y-1 active:shadow-none"
                >
                  INITIATE_SYNC
                </button>
              </div>
            )}
            
            {/* Binary Noise Overlay */}
            <div className="absolute top-0 left-0 text-[8px] opacity-10 text-[#00ffff] pointer-events-none select-none text-left w-full h-full overflow-hidden leading-none break-all p-2">
               {Array(1000).fill(0).map(() => Math.round(Math.random()))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

