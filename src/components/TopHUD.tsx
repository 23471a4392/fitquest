import React from 'react';
import type { ActivePowerUp, PlayerProfile } from '../types/game';
import { calculateBMI, getBMICategory, getBMICategoryMeta, formatWeight, formatScore, formatDistance } from '../utils/gameLogic';
import { Heart, Zap, Pause, Volume2, VolumeX, Music, Flame, Award } from 'lucide-react';

interface TopHUDProps {
  player: PlayerProfile;
  currentWeight: number;
  health: number;
  energy: number;
  score: number;
  distance: number;
  targetDistance: number;
  activePowerUps: ActivePowerUp[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onPause: () => void;
}

export const TopHUD: React.FC<TopHUDProps> = ({
  player,
  currentWeight,
  health,
  energy,
  score,
  distance,
  targetDistance,
  activePowerUps,
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onPause,
}) => {
  const currentBMI = calculateBMI(currentWeight, player.heightCm);
  const bmiCategory = getBMICategory(currentBMI);
  const meta = getBMICategoryMeta(bmiCategory);
  const progressPercent = Math.min(100, Math.max(0, (distance / targetDistance) * 100));
  const weightDelta = Math.round((currentWeight - player.currentWeightKg) * 100) / 100;

  return (
    <div className="w-full flex flex-col gap-2.5 mb-3 select-none">
      {/* Top Header Bar: Player Profile & Quick Controls */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-lime-500/30 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 font-bold text-base">
            {player.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 text-sm">{player.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-lime-400 border border-lime-500/30 font-medium">
                Goal: {player.fitnessGoal.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-3">
              <span>H: {player.heightCm} cm</span>
              <span>Target: {player.targetWeightKg} kg</span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition ${
              soundEnabled
                ? 'bg-lime-500/20 border-lime-500/40 text-lime-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-lg border transition ${
              musicEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
            title={musicEnabled ? 'Stop Workout Synth Beat' : 'Play Workout Synth Beat'}
          >
            <Music size={16} />
          </button>

          <button
            onClick={onPause}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold text-xs hover:bg-amber-500/30 active:scale-95 transition"
          >
            <Pause size={14} />
            <span>PAUSE</span>
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Weight & Delta Card */}
        <div className="bg-slate-900/80 border border-lime-500/25 rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Weight</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-lime-400">{formatWeight(currentWeight)}</span>
            {weightDelta !== 0 && (
              <span
                className={`text-xs font-bold ${
                  weightDelta < 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {weightDelta > 0 ? `+${weightDelta.toFixed(2)}` : `${weightDelta.toFixed(2)}`} kg
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Target: {player.targetWeightKg} kg</div>
        </div>

        {/* Live BMI Card */}
        <div className="bg-slate-900/80 border border-lime-500/25 rounded-xl p-3 flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Live BMI</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-extrabold text-slate-100">{currentBMI}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold ${meta.badgeBg}`}>
              {bmiCategory}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">General Screening Metric</div>
        </div>

        {/* Health & Energy Bars */}
        <div className="bg-slate-900/80 border border-lime-500/25 rounded-xl p-2.5 flex flex-col justify-between gap-1.5">
          {/* Health Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-rose-400">
                <Heart size={12} className="fill-rose-500 text-rose-500 animate-pulse" />
                <span>Health</span>
              </span>
              <span>{Math.round(health)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, health))}%` }}
              />
            </div>
          </div>

          {/* Energy Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-amber-400">
                <Zap size={12} className="fill-amber-400 text-amber-400" />
                <span>Energy</span>
              </span>
              <span>{Math.round(energy)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-lime-400 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, energy))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-slate-900/80 border border-lime-500/25 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Score</span>
            <Flame size={14} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 tracking-tight mt-0.5">
            {formatScore(score)}
          </div>
          <div className="text-[10px] text-lime-400 flex items-center gap-1">
            <Award size={11} />
            <span>Active Multiplier</span>
          </div>
        </div>
      </div>

      {/* Distance & Goal Progress Bar */}
      <div className="bg-slate-900/80 border border-lime-500/25 rounded-xl px-4 py-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold flex items-center gap-1.5">
            <span>🏃 Distance:</span>
            <span className="text-lime-400 font-bold">{formatDistance(distance)}</span>
            <span className="text-slate-500">/ {formatDistance(targetDistance)}</span>
          </span>
          <span className="text-lime-400 font-extrabold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-lime-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Active Powerups Row */}
      {activePowerUps.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {activePowerUps.map((p, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lime-500/20 border border-lime-500/40 text-lime-300 text-xs font-semibold animate-pulse"
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
