import React from 'react';
import type { LevelConfig } from '../types/game';
import { GAME_LEVELS } from '../data/gameConstants';
import { formatDistance } from '../utils/gameLogic';
import { Play, Lock, ArrowLeft, Zap, Shield, Flag } from 'lucide-react';

interface LevelSelectScreenProps {
  unlockedLevels: number[];
  selectedLevel: LevelConfig;
  onSelectAndPlay: (level: LevelConfig) => void;
  onBack: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  unlockedLevels,
  selectedLevel,
  onSelectAndPlay,
  onBack,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Select Course</h1>
          <p className="text-xs text-slate-400">Choose your distance & endurance challenge</p>
        </div>

        <div className="w-16" />
      </div>

      {/* Levels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GAME_LEVELS.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          const isCurrent = selectedLevel.id === level.id;

          return (
            <div
              key={level.id}
              className={`relative overflow-hidden rounded-2xl p-5 border transition flex flex-col justify-between ${
                isUnlocked
                  ? isCurrent
                    ? 'bg-slate-900/95 border-lime-400 shadow-xl ring-1 ring-lime-400/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-lime-500/50'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              {/* Top Row: Title & Distance Badge */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider block">
                    {level.subtitle}
                  </span>
                  <h3 className="text-lg font-black text-slate-100">{level.name}</h3>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-lime-500/30 text-lime-400 text-xs font-bold">
                  <Flag size={12} />
                  <span>{formatDistance(level.targetDistanceMeters)}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">{level.description}</p>

              {/* Difficulty indicators */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-4">
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-amber-400" />
                  <span>Base Speed: {level.baseSpeed} m/s</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield size={12} className="text-emerald-400" />
                  <span>Hazards: {Math.round(level.obstacleFrequency * 100)}%</span>
                </div>
              </div>

              {/* Action Button */}
              {isUnlocked ? (
                <button
                  onClick={() => onSelectAndPlay(level)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-lime-500/20 active:scale-98 transition"
                >
                  <Play size={14} className="fill-slate-950" />
                  <span>RUN THIS LEVEL</span>
                </button>
              ) : (
                <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-500 font-bold text-xs flex items-center justify-center gap-2">
                  <Lock size={14} />
                  <span>Locked (Complete Level {level.id - 1})</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
