import React from 'react';
import type { PlayerProfile } from '../types/game';
import {
  Play,
  HelpCircle,
  Trophy,
  Info,
  Calendar,
  Award,
  BarChart2,
  Settings,
  Layers,
  Sparkles,
  Activity,
  UserCheck,
} from 'lucide-react';

interface WelcomeScreenProps {
  player: PlayerProfile | null;
  onStartGame: () => void;
  onOpenSetup: () => void;
  onOpenHowToPlay: () => void;
  onOpenLeaderboard: () => void;
  onOpenAbout: () => void;
  onOpenLevelSelect: () => void;
  onOpenDailyChallenges: () => void;
  onOpenAchievements: () => void;
  onOpenStatistics: () => void;
  onOpenSettings: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  player,
  onStartGame,
  onOpenSetup,
  onOpenHowToPlay,
  onOpenLeaderboard,
  onOpenAbout,
  onOpenLevelSelect,
  onOpenDailyChallenges,
  onOpenAchievements,
  onOpenStatistics,
  onOpenSettings,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 animate-fade-in flex flex-col gap-8">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-lime-500/40 rounded-3xl p-6 sm:p-12 shadow-2xl text-center">
        {/* Athletic Background Accents */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Motivational Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-bold tracking-widest uppercase mb-4">
          <Sparkles size={14} className="animate-spin-slow" />
          <span>Interactive Fitness & Nutrition Gaming</span>
        </div>

        {/* Game Title */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-100 uppercase">
          FIT<span className="text-lime-400">QUEST</span>
        </h1>

        {/* Motto */}
        <p className="text-lg sm:text-2xl font-bold text-lime-300/90 tracking-wide mt-2">
          “Eat Smart. Run Strong. Reach Your Goal.”
        </p>

        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-3 leading-relaxed">
          Sprint through dynamic tracks, dodge junk food temptations, grab clean whole foods, and navigate
          real-time metabolic changes as you race toward your target weight!
        </p>

        {/* Active Player Status Badge */}
        {player ? (
          <div className="inline-flex items-center gap-3 bg-slate-950/80 border border-lime-500/30 rounded-2xl px-4 py-2 mt-5 text-left">
            <div className="w-9 h-9 rounded-xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 font-bold">
              <UserCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <span>Runner: {player.name}</span>
                <span className="text-[10px] text-lime-400 font-normal">
                  ({player.currentWeightKg}kg → {player.targetWeightKg}kg)
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                BMI: {player.initialBMI} ({player.initialBMICategory}) • Goal: {player.fitnessGoal.replace('_', ' ')}
              </div>
            </div>
            <button
              onClick={onOpenSetup}
              className="text-[11px] font-semibold text-lime-400 hover:text-lime-300 underline ml-2"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={onOpenSetup}
              className="text-xs text-lime-400/90 hover:text-lime-300 underline"
            >
              Configure runner profile & initial metrics
            </button>
          </div>
        )}

        {/* Primary Play Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
          <button
            onClick={player ? onStartGame : onOpenSetup}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-lg tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl shadow-lime-500/25 active:scale-95 transition transform"
          >
            <Play size={22} className="fill-slate-950" />
            <span>START GAME</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-lime-500/30 text-lime-400 font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 transition active:scale-95"
          >
            <Layers size={18} />
            <span>SELECT LEVEL</span>
          </button>
        </div>

        {/* Core Game Features Strip */}
        <div className="grid grid-cols-3 gap-2 mt-8 max-w-md mx-auto pt-6 border-t border-slate-800">
          <div className="flex flex-col items-center">
            <span className="text-lime-400 text-lg font-bold">3 LANES</span>
            <span className="text-[11px] text-slate-400">Perspective Run</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-emerald-400 text-lg font-bold">REAL BMI</span>
            <span className="text-[11px] text-slate-400">Dynamic Simulation</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-amber-400 text-lg font-bold">WEB AUDIO</span>
            <span className="text-[11px] text-slate-400">Pure Synth Arcade</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* How to Play */}
        <button
          onClick={onOpenHowToPlay}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-110 transition">
            <HelpCircle size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">How to Play</span>
          <span className="text-[11px] text-slate-400">Controls, foods & mechanics</span>
        </button>

        {/* Leaderboard */}
        <button
          onClick={onOpenLeaderboard}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
            <Trophy size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Leaderboard</span>
          <span className="text-[11px] text-slate-400">Top scores & rankings</span>
        </button>

        {/* Daily Challenges */}
        <button
          onClick={onOpenDailyChallenges}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
            <Calendar size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Daily Challenges</span>
          <span className="text-[11px] text-slate-400">Earn bonus XP & rewards</span>
        </button>

        {/* Achievements */}
        <button
          onClick={onOpenAchievements}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
            <Award size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Achievements</span>
          <span className="text-[11px] text-slate-400">Unlock 10+ athletic badges</span>
        </button>

        {/* Statistics */}
        <button
          onClick={onOpenStatistics}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-110 transition">
            <BarChart2 size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Statistics</span>
          <span className="text-[11px] text-slate-400">Lifetime runs & charts</span>
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:scale-110 transition">
            <Settings size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Settings</span>
          <span className="text-[11px] text-slate-400">Audio, theme, difficulty</span>
        </button>

        {/* Runner Profile */}
        <button
          onClick={onOpenSetup}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
            <Activity size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">Player Profile</span>
          <span className="text-[11px] text-slate-400">Height, weight & goals</span>
        </button>

        {/* About & Disclaimer */}
        <button
          onClick={onOpenAbout}
          className="glass-panel-interactive rounded-2xl p-4 flex flex-col items-center text-center gap-2 text-slate-200 group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
            <Info size={24} />
          </div>
          <span className="font-extrabold text-sm text-slate-100">About</span>
          <span className="text-[11px] text-slate-400">Science & health disclaimer</span>
        </button>
      </div>
    </div>
  );
};
