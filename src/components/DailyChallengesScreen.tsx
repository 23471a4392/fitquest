import React from 'react';
import type { DailyChallenge } from '../types/game';
import { Calendar, ArrowLeft, Gift, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioSystem';

interface DailyChallengesScreenProps {
  challenges: DailyChallenge[];
  onClaimReward: (challengeId: string) => void;
  onBack: () => void;
  onPlayNow: () => void;
}

export const DailyChallengesScreen: React.FC<DailyChallengesScreenProps> = ({
  challenges,
  onClaimReward,
  onBack,
  onPlayNow,
}) => {
  const completedCount = challenges.filter((c) => c.completed).length;

  const handleClaim = (id: string) => {
    soundEngine.playPowerUp();
    onClaimReward(id);
  };

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
            <Calendar size={14} />
            <span>Daily Workout Quests</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Daily Challenges</h1>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          Play Run
        </button>
      </div>

      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Progress</span>
          <div className="text-2xl font-black text-slate-100 mt-0.5">
            {completedCount} of {challenges.length} Completed
          </div>
          <span className="text-xs text-lime-400 mt-1 block">
            Resets automatically at midnight with fresh athletic tasks!
          </span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-3xl">
          🎯
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {challenges.map((c) => {
          const progressPercent = Math.min(100, Math.round((c.current / c.target) * 100));

          return (
            <div
              key={c.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition ${
                c.claimed
                  ? 'bg-slate-950/70 border-slate-800/80 opacity-75'
                  : c.completed
                  ? 'bg-slate-900/95 border-lime-400 shadow-lg ring-1 ring-lime-400/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h3 className="font-black text-sm text-slate-100">{c.title}</h3>
                      <span className="text-[11px] text-lime-400 font-semibold">
                        Reward: +{c.bonusPoints} XP Bonus
                      </span>
                    </div>
                  </div>

                  {c.claimed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      Claimed ✓
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-3">{c.description}</p>
              </div>

              <div>
                {/* Progress bar */}
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Progress</span>
                  <span className="font-bold text-slate-200">
                    {c.current} / {c.target} ({progressPercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Claim button */}
                {c.completed && !c.claimed ? (
                  <button
                    onClick={() => handleClaim(c.id)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-lime-500 hover:from-amber-300 hover:to-lime-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 transition"
                  >
                    <Gift size={15} />
                    <span>CLAIM +{c.bonusPoints} BONUS</span>
                  </button>
                ) : c.claimed ? (
                  <div className="py-2 text-center text-xs text-slate-500 font-semibold">
                    Reward Claimed for Today
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
                    <Sparkles size={12} className="text-slate-600" />
                    <span>Keep running to complete</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
