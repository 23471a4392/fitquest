import React from 'react';
import type { Achievement } from '../types/game';
import { Award, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsScreenProps {
  achievements: Achievement[];
  onBack: () => void;
  onPlayNow: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  achievements,
  onBack,
  onPlayNow,
}) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

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
            <Award size={14} />
            <span>Athletic Hall of Badges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Achievements</h1>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          Play Run
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Unlocked</span>
          <div className="text-2xl font-black text-lime-400 mt-0.5">
            {unlockedCount} of {achievements.length} Badges Earned
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            Complete high scores, clean nutritional streaks, and marathon distances to unlock all badges.
          </span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl">
          🏅
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

          return (
            <div
              key={ach.id}
              className={`rounded-2xl p-5 border transition flex items-start gap-4 ${
                ach.unlocked
                  ? 'bg-slate-900/95 border-lime-500/40 shadow-lg ring-1 ring-lime-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                  ach.unlocked
                    ? 'bg-lime-500/20 border-lime-500/40 shadow-md shadow-lime-500/20'
                    : 'bg-slate-800/50 border-slate-700/50 grayscale'
                }`}
              >
                {ach.icon}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-slate-100">{ach.title}</h3>
                  {ach.unlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <CheckCircle2 size={13} />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <Lock size={12} />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>

                {/* Progress bar if not unlocked */}
                {!ach.unlocked && ach.target > 1 && (
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {ach.progress} / {ach.target} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime-500/80 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {ach.unlockedAt && (
                  <span className="text-[10px] text-slate-500 block mt-2">
                    Unlocked on {ach.unlockedAt.slice(0, 10)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
