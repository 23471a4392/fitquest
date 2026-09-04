import React, { useState } from 'react';
import type { LeaderboardEntry } from '../types/game';
import { formatDistance, formatScore } from '../utils/gameLogic';
import { Trophy, ArrowLeft, Medal, Search } from 'lucide-react';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
  onPlayNow: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  entries,
  onBack,
  onPlayNow,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRank, setFilterRank] = useState<string>('all');

  const filteredEntries = entries.filter((e) => {
    const matchesSearch = e.playerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = filterRank === 'all' || e.rankGrade === filterRank;
    return matchesSearch && matchesRank;
  });

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (rank === 2) return 'bg-slate-300/20 text-slate-300 border-slate-300/40';
    if (rank === 3) return 'bg-amber-700/20 text-amber-600 border-amber-700/40';
    return 'bg-slate-800 text-slate-400 border-slate-700';
  };

  const getGradeStyle = (grade: string) => {
    if (grade === 'S') return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
    if (grade === 'A') return 'text-lime-400 bg-lime-500/15 border-lime-500/30';
    if (grade === 'B') return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
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
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Trophy size={14} />
            <span>Athletic Hall of Fame</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Global Leaderboard</h1>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          Play Run
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search runner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <span className="text-xs text-slate-400 mr-1">Grade:</span>
          {['all', 'S', 'A', 'B', 'C'].map((g) => (
            <button
              key={g}
              onClick={() => setFilterRank(g)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border transition ${
                filterRank === g
                  ? 'bg-lime-500/20 border-lime-500 text-lime-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-lime-500/25 bg-slate-900/90 backdrop-blur-md shadow-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-bold bg-slate-950/60">
              <th className="py-3.5 px-4 text-center w-14">Rank</th>
              <th className="py-3.5 px-4">Player</th>
              <th className="py-3.5 px-4 text-right">Score</th>
              <th className="py-3.5 px-4 text-center">BMI Delta</th>
              <th className="py-3.5 px-4 text-center">Healthy Picks</th>
              <th className="py-3.5 px-4 text-right">Distance</th>
              <th className="py-3.5 px-4 text-center">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No records match your search criteria.
                </td>
              </tr>
            ) : (
              filteredEntries.map((entry, idx) => (
                <tr
                  key={entry.id || idx}
                  className="hover:bg-slate-800/40 transition group"
                >
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border font-black text-xs ${getRankBadgeStyle(
                        idx + 1
                      )}`}
                    >
                      {idx < 3 ? <Medal size={14} /> : idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200">
                    <div className="flex flex-col">
                      <span>{entry.playerName}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {entry.levelName} • {entry.date}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    {formatScore(entry.score)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-semibold ${
                        entry.bmiImprovement > 0 ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {entry.bmiImprovement > 0 ? `-${entry.bmiImprovement}` : '0.0'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-lime-400">{entry.healthyChoices} 🥗</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 font-medium">
                    {formatDistance(entry.distanceMeters)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block w-6 h-6 rounded-md border font-black text-xs leading-5 text-center ${getGradeStyle(
                        entry.rankGrade
                      )}`}
                    >
                      {entry.rankGrade}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
