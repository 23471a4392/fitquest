import React, { useState } from 'react';
import type { GameSummary } from '../types/game';
import { formatDistance, formatScore, formatWeight, getBMICategoryMeta } from '../utils/gameLogic';
import { addLeaderboardEntry } from '../utils/storage';
import { CheckCircle2, RotateCcw, ArrowRight, Trophy, BarChart3 } from 'lucide-react';

interface ResultScreenProps {
  summary: GameSummary;
  hasNextLevel: boolean;
  onPlayAgain: () => void;
  onNextLevel: () => void;
  onGoToLeaderboard: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  summary,
  hasNextLevel,
  onPlayAgain,
  onNextLevel,
  onGoToLeaderboard,
  onGoHome,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const finalMeta = getBMICategoryMeta(summary.bmiCategory);

  const handleSaveToLeaderboard = () => {
    if (isSaved) return;
    addLeaderboardEntry({
      id: `lb_${Date.now()}`,
      playerName: summary.player.name,
      score: summary.finalScore,
      bmiImprovement: Math.round((summary.initialBMI - summary.finalBMI) * 10) / 10,
      healthyChoices: summary.healthyFoodsCollected,
      junkChoices: summary.junkFoodsCollected,
      distanceMeters: summary.distanceCoveredMeters,
      rankGrade: summary.rank,
      date: new Date().toISOString().slice(0, 10),
      levelName: summary.level.name,
    });
    setIsSaved(true);
  };

  const getRankBadgeClass = (rank: string) => {
    switch (rank) {
      case 'S':
        return 'border-amber-400 text-amber-300 bg-amber-500/20 shadow-amber-500/30';
      case 'A':
        return 'border-lime-400 text-lime-300 bg-lime-500/20 shadow-lime-500/30';
      case 'B':
        return 'border-emerald-400 text-emerald-300 bg-emerald-500/20 shadow-emerald-500/30';
      case 'C':
        return 'border-orange-400 text-orange-300 bg-orange-500/20 shadow-orange-500/30';
      default:
        return 'border-rose-400 text-rose-300 bg-rose-500/20 shadow-rose-500/30';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 animate-fade-in">
      <div className="bg-slate-900/95 border-2 border-lime-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
        {/* Header Banner */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-500/20 border border-lime-500/40 text-lime-400 font-black text-xs uppercase tracking-widest mb-3">
            <CheckCircle2 size={16} />
            <span>Goal Achieved – Quest Complete!</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
            RUNNER EVALUATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Completed {summary.level.name} ({formatDistance(summary.distanceCoveredMeters)}) in{' '}
            {summary.timeElapsedSeconds}s
          </p>
        </div>

        {/* Top Highlight: Score & Rank Stamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/70 border border-lime-500/30 rounded-2xl p-5 items-center">
          {/* Final Score */}
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Run Score</span>
            <div className="text-4xl sm:text-5xl font-black text-lime-400 tracking-tight mt-1">
              {formatScore(summary.finalScore)}
            </div>
            <span className="text-xs text-slate-500 mt-1">
              Player: <strong className="text-slate-200">{summary.player.name}</strong> • Goal:{' '}
              <strong className="text-slate-200">{summary.player.fitnessGoal.replace('_', ' ')}</strong>
            </span>
          </div>

          {/* Performance Rank Badge */}
          <div className="flex items-center justify-start sm:justify-end gap-4">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 flex items-center justify-center font-black text-4xl sm:text-5xl shadow-xl ${getRankBadgeClass(
                summary.rank
              )}`}
            >
              {summary.rank}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Performance Rank</span>
              <span className="text-base sm:text-lg font-extrabold text-slate-200">{summary.rankTitle}</span>
              <span className="text-xs text-lime-400 mt-0.5">
                {summary.rank === 'S'
                  ? 'Flawless nutritional discipline!'
                  : summary.rank === 'A'
                  ? 'Outstanding athletic pacing!'
                  : summary.rank === 'B'
                  ? 'Solid foundation, push further!'
                  : 'Watch out for sneaky junk traps!'}
              </span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Cards: Weight & BMI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weight Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">Weight Progression</span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  summary.weightChange < 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : summary.weightChange === 0
                    ? 'bg-slate-800 text-slate-300'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {summary.weightChange > 0 ? `+${summary.weightChange}` : summary.weightChange} kg
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Initial</span>
                <span className="font-bold text-slate-200">{formatWeight(summary.initialWeight)}</span>
              </div>
              <ArrowRight size={16} className="text-lime-400" />
              <div>
                <span className="text-[11px] text-slate-500 block">Finish</span>
                <span className="font-extrabold text-lime-400">{formatWeight(summary.finalWeight)}</span>
              </div>
              <div className="h-6 w-px bg-slate-800" />
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Target</span>
                <span className="font-bold text-emerald-400">{formatWeight(summary.player.targetWeightKg)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {summary.weightChange < 0
                ? 'Your healthy choices helped burn calories and guide your weight toward target.'
                : 'Excess junk items increased water retention and body mass.'}
            </p>
          </div>

          {/* BMI Card */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-400">BMI Metric Progression</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${finalMeta.badgeBg}`}>
                {summary.bmiCategory}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm py-2">
              <div>
                <span className="text-[11px] text-slate-500 block">Initial BMI</span>
                <span className="font-bold text-slate-200">{summary.initialBMI}</span>
                <span className="text-[10px] text-slate-500 block">({summary.player.initialBMICategory})</span>
              </div>
              <ArrowRight size={16} className="text-lime-400" />
              <div>
                <span className="text-[11px] text-slate-500 block">Final BMI</span>
                <span className="font-extrabold text-lime-400">{summary.finalBMI}</span>
                <span className="text-[10px] text-slate-400 block">({summary.bmiCategory})</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Screening metric calculated dynamically from final weight & height.
            </p>
          </div>
        </div>

        {/* Nutritional & Gameplay Choices Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-2xl block mb-1">🥗</span>
            <span className="text-xs text-slate-400 block">Healthy Foods</span>
            <span className="text-lg font-black text-lime-400">{summary.healthyFoodsCollected}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-2xl block mb-1">🍔</span>
            <span className="text-xs text-slate-400 block">Junk Foods</span>
            <span className="text-lg font-black text-rose-400">{summary.junkFoodsCollected}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-2xl block mb-1">💥</span>
            <span className="text-xs text-slate-400 block">Obstacles Hit</span>
            <span className="text-lg font-black text-amber-400">{summary.obstaclesHit}</span>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-2xl block mb-1">⭐</span>
            <span className="text-xs text-slate-400 block">Power-Ups</span>
            <span className="text-lg font-black text-cyan-400">{summary.powerUpsCollected}</span>
          </div>
        </div>

        {/* Dynamic Scoring Algorithm Breakdown */}
        <div className="bg-slate-950/60 border border-lime-500/25 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <BarChart3 size={14} className="text-lime-400" />
            <span>Score Calculation Audit</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Base Level Score</span>
              <span className="font-semibold text-slate-200">+{summary.scoreBreakdown.baseScore}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Healthy Foods ({summary.healthyFoodsCollected} × 50)</span>
              <span className="font-semibold text-lime-400">+{summary.scoreBreakdown.healthyBonus}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Junk Food Penalties ({summary.junkFoodsCollected} × -75)</span>
              <span className="font-semibold text-rose-400">-{summary.scoreBreakdown.junkPenalty}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Obstacle Hits ({summary.obstaclesHit} × -50)</span>
              <span className="font-semibold text-rose-400">-{summary.scoreBreakdown.obstaclePenalty}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Power-Ups ({summary.powerUpsCollected} × 100)</span>
              <span className="font-semibold text-cyan-400">+{summary.scoreBreakdown.powerUpBonus}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Distance Completed Bonus</span>
              <span className="font-semibold text-slate-200">+{summary.scoreBreakdown.distanceBonus}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Healthy Diet Ratio Bonus (70%+)</span>
              <span className="font-semibold text-lime-400">+{summary.scoreBreakdown.healthyChoiceBonus}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Finish Goal Bonus</span>
              <span className="font-semibold text-amber-400">+{summary.scoreBreakdown.goalCompletionBonus}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80 sm:col-span-2">
              <span className="text-slate-400">BMI Target Alignment Bonus</span>
              <span className="font-semibold text-emerald-400">+{summary.scoreBreakdown.bmiImprovementBonus}</span>
            </div>
          </div>
        </div>

        {/* Actions & Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveToLeaderboard}
              disabled={isSaved}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                isSaved
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 cursor-default'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/40 text-amber-400'
              }`}
            >
              <Trophy size={15} />
              <span>{isSaved ? 'Recorded in Leaderboard ✓' : 'Save to Leaderboard'}</span>
            </button>

            <button
              onClick={onGoToLeaderboard}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              View Board
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPlayAgain}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <RotateCcw size={14} />
              <span>Play Again</span>
            </button>

            {hasNextLevel ? (
              <button
                onClick={onNextLevel}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-lime-500/20 active:scale-95 transition"
              >
                <span>NEXT LEVEL</span>
                <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={onGoHome}
                className="px-5 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-black transition"
              >
                MAIN MENU
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
