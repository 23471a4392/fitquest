import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';
import { HEALTHY_FOODS, JUNK_FOODS, OBSTACLES, POWER_UPS } from '../data/gameConstants';

interface HowToPlayScreenProps {
  onBack: () => void;
  onPlayNow: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onBack, onPlayNow }) => {
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
            <Activity size={14} />
            <span>Athletic Manual & Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">How to Play</h1>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          Play Game
        </button>
      </div>

      {/* 1. Core Mechanics & Controls */}
      <div className="bg-slate-900/90 border border-lime-500/30 rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
        <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
          <span>🎮</span>
          <span>Running Mechanics & Controls</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Your runner dashes forward across 3 track lanes (<strong>LEFT | CENTER | RIGHT</strong>). Your
          mission is to navigate toward the finish line while making smart dietary choices and leaping over
          sedentary lifestyle traps.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-xs font-extrabold uppercase text-lime-400 block mb-2">Desktop Controls</span>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">A</kbd> /{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">←</kbd> : Move to Left Lane
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">D</kbd> /{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">→</kbd> : Move to Right Lane
              </li>
              <li>
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">SPACE</kbd> /{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-lime-300 font-mono">W</kbd> : Jump Over Obstacles
              </li>
            </ul>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <span className="text-xs font-extrabold uppercase text-emerald-400 block mb-2">Mobile & Touch</span>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>• <strong>Swipe Left / Right</strong>: Quick lane shift</li>
              <li>• <strong>Swipe Up</strong>: High hurdle jump</li>
              <li>• <strong>On-Screen Touch D-Pad</strong>: Dedicated bottom control buttons</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Healthy vs Junk Foods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Healthy Foods */}
        <div className="bg-slate-900/90 border border-lime-500/40 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥗</span>
            <div>
              <h3 className="font-extrabold text-sm text-lime-400 uppercase">Healthy Whole Foods</h3>
              <span className="text-[11px] text-slate-400">Collect as many as possible!</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Consuming whole foods repairs cellular tissue, replenishes muscular glycogen, and guides your weight
            toward your target goal.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {HEALTHY_FOODS.map((f) => (
              <span
                key={f.id}
                className="px-2.5 py-1 rounded-lg bg-lime-500/15 border border-lime-500/30 text-lime-300 text-xs font-medium flex items-center gap-1.5"
              >
                <span>{f.emoji}</span>
                <span>{f.name}</span>
              </span>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 mt-1">
            ✓ +10 Health • +Score Bonus • -0.05 to -0.15kg towards target • Speed boost
          </div>
        </div>

        {/* Junk Foods */}
        <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <div>
              <h3 className="font-extrabold text-sm text-rose-400 uppercase">Junk Food Traps</h3>
              <span className="text-[11px] text-slate-400">Avoid collecting these!</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            High sodium and ultra-processed sugars cause an immediate energy crash, increase body mass index,
            and reduce your overall running pace.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {JUNK_FOODS.map((f) => (
              <span
                key={f.id}
                className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5"
              >
                <span>{f.emoji}</span>
                <span>{f.name}</span>
              </span>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80 mt-1">
            ⚠ -10 Health • -15 Score • +0.05 to +0.20kg weight penalty • Sluggish crash
          </div>
        </div>
      </div>

      {/* 3. Obstacles */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 flex flex-col gap-3">
        <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
          <span>🚧</span>
          <span>Sedentary Obstacles & Road Hazards</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Watch out for lazy lifestyle hazards! Jumping with <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-lime-300 text-[10px]">SPACE</kbd> allows
          you to clear low obstacles, while the Immune Shield absorbs impacts completely.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {OBSTACLES.slice(0, 4).map((obs) => (
            <div
              key={obs.id}
              className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 text-center"
            >
              <span className="text-2xl block mb-1">{obs.emoji}</span>
              <span className="text-xs font-bold text-slate-200 block">{obs.name}</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{obs.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Power-Ups */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 flex flex-col gap-3">
        <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
          <span>⚡</span>
          <span>Healthy Power-Ups</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {POWER_UPS.slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="bg-slate-950/70 border border-cyan-500/25 rounded-xl p-3 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{p.emoji}</span>
                <span className="text-xs font-extrabold text-cyan-300">{p.name}</span>
              </div>
              <p className="text-[11px] text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
