import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Music } from 'lucide-react';

interface PauseModalProps {
  isOpen: boolean;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  isOpen,
  soundEnabled,
  musicEnabled,
  onResume,
  onRestart,
  onQuit,
  onToggleSound,
  onToggleMusic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border-2 border-lime-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-center">
        {/* Header */}
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-widest mb-2">
            Game Paused
          </div>
          <h2 className="text-2xl font-black text-slate-100 tracking-tight">Catch Your Breath!</h2>
          <p className="text-xs text-slate-400 mt-1">
            "Fitness is not about being better than someone else. It's about being better than you were yesterday."
          </p>
        </div>

        {/* Quick Audio Controls in Pause Menu */}
        <div className="flex items-center justify-center gap-3 py-2 bg-slate-950/60 rounded-xl border border-slate-800">
          <button
            onClick={onToggleSound}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition ${
              soundEnabled
                ? 'bg-lime-500/20 border-lime-500/40 text-lime-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>SFX {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition ${
              musicEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Music size={16} />
            <span>Music {musicEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 active:scale-98 transition"
          >
            <Play size={18} className="fill-slate-950" />
            <span>RESUME RUN</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <RotateCcw size={16} />
            <span>Restart Level</span>
          </button>

          <button
            onClick={onQuit}
            className="w-full py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <Home size={16} />
            <span>Quit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
