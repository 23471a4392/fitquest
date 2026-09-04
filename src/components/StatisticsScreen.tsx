import React from 'react';
import type { Achievement, LifetimeStats } from '../types/game';
import { formatDistance, formatScore } from '../utils/gameLogic';
import { BarChart3, ArrowLeft, Flame, Target, Salad, Award, Zap } from 'lucide-react';

interface StatisticsScreenProps {
  stats: LifetimeStats;
  achievements: Achievement[];
  onBack: () => void;
  onPlayNow: () => void;
}

export const StatisticsScreen: React.FC<StatisticsScreenProps> = ({
  stats,
  achievements,
  onBack,
  onPlayNow,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalFood = stats.totalHealthyFoods + stats.totalJunkFoods;
  const healthyPercent = totalFood > 0 ? Math.round((stats.totalHealthyFoods / totalFood) * 100) : 100;
  const avgScore = stats.totalRuns > 0 ? Math.round(stats.highestScore / 1.4) : 0;

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
          <div className="inline-flex items-center gap-1.5 text-lime-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <BarChart3 size={14} />
            <span>Lifetime Performance Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Athletic Statistics</h1>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          New Run
        </button>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Distance</span>
          <div className="text-2xl font-black text-lime-400 mt-1">
            {formatDistance(stats.totalDistanceMeters)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">{stats.totalRuns} Career Runs</span>
        </div>

        <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase">Personal Best</span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatScore(stats.highestScore)}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Avg ~{formatScore(avgScore)}</span>
        </div>

        <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase">Goals Reached</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {stats.goalsCompleted} 🏁
          </div>
          <span className="text-[10px] text-slate-500 mt-1">
            {stats.totalRuns > 0 ? `${Math.round((stats.goalsCompleted / stats.totalRuns) * 100)}% Finish Rate` : '0%'}
          </span>
        </div>

        <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-4 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold uppercase">Achievements</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {unlockedCount} / {achievements.length}
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Badges Claimed</span>
        </div>
      </div>

      {/* Nutritional Choices Ratio Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
            <Salad size={14} className="text-lime-400" />
            <span>Nutritional Fueling Ratio</span>
          </span>
          <span className="text-xs font-black text-lime-400">{healthyPercent}% Healthy Clean Diet</span>
        </div>

        {/* Visual Bar */}
        <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex p-0.5">
          <div
            className="h-full bg-lime-500 rounded-l-full transition-all duration-500"
            style={{ width: `${healthyPercent}%` }}
          />
          <div
            className="h-full bg-rose-500 rounded-r-full transition-all duration-500"
            style={{ width: `${100 - healthyPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
            <span>Healthy Whole Foods: <strong className="text-lime-400">{stats.totalHealthyFoods}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Junk Food Traps: <strong className="text-rose-400">{stats.totalJunkFoods}</strong></span>
          </span>
        </div>
      </div>

      {/* Detailed Lifetime Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4">
          Full Gameplay Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Flame size={14} className="text-amber-400" />
              <span>Obstacles Dodged / Collided</span>
            </span>
            <span className="font-bold text-slate-200">{stats.totalObstaclesHit}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Zap size={14} className="text-cyan-400" />
              <span>Special Power-Ups Grabbed</span>
            </span>
            <span className="font-bold text-slate-200">{stats.totalPowerUps}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Target size={14} className="text-emerald-400" />
              <span>Best BMI Delta Towards Target</span>
            </span>
            <span className="font-bold text-emerald-400">
              {stats.bestBMIImprovement > 0 ? `-${stats.bestBMIImprovement.toFixed(1)}` : '0.0'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-2">
              <Award size={14} className="text-lime-400" />
              <span>Total Athletic Runs</span>
            </span>
            <span className="font-bold text-slate-200">{stats.totalRuns}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
