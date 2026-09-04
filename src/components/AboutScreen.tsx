import React from 'react';
import { ArrowLeft, ShieldAlert, HeartPulse, Apple, Award } from 'lucide-react';
import { MEDICAL_DISCLAIMER_TEXT } from '../data/gameConstants';

interface AboutScreenProps {
  onBack: () => void;
  onPlayNow: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack, onPlayNow }) => {
  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-4 animate-fade-in flex flex-col gap-6">
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">About FitQuest</h1>
          <p className="text-xs text-slate-400">Concept, nutrition simulation & science</p>
        </div>

        <button
          onClick={onPlayNow}
          className="px-4 py-2 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 text-xs font-bold transition"
        >
          Play Game
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-slate-900/90 border border-lime-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-6">
        {/* Mission */}
        <div>
          <h2 className="text-xl font-black text-slate-100 mb-2 flex items-center gap-2">
            <span className="text-lime-400">⚡</span>
            <span>The FitQuest Philosophy</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Most fitness applications feel like dry spreadsheets and boring calorie journals.
            <strong> FitQuest: Eat Smart, Run Strong</strong> was designed to transform nutrition and daily
            endurance into an exhilarating modern runner. Every decision on the track mirrors real-world
            metabolic choices: whole foods provide clean cellular endurance, while ultra-processed junk
            foods create sluggish digestion, dehydration, and energy crashes.
          </p>
        </div>

        {/* Nutritional Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center text-lime-400 mb-1">
              <Apple size={18} />
            </div>
            <h3 className="font-bold text-xs text-slate-100 uppercase">Clean Micronutrients</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Fiber, electrolytes, and antioxidants maintain cellular integrity and sustain a high running pace.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-1">
              <HeartPulse size={18} />
            </div>
            <h3 className="font-bold text-xs text-slate-100 uppercase">Balanced Simulation</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Weight adjustments in FitQuest are modeled with micro-incremental adaptations (-0.05 to +0.20 kg).
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
              <Award size={18} />
            </div>
            <h3 className="font-bold text-xs text-slate-100 uppercase">Holistic Ranking</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Performance ranks (S/A/B/C/D) weigh nutrition choices, obstacle evasion, and goal completion together.
            </p>
          </div>
        </div>

        {/* Official Medical Disclaimer */}
        <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-400">
            <ShieldAlert size={20} />
            <h3 className="text-sm font-black uppercase tracking-wider">Official Medical & Screening Disclaimer</h3>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">{MEDICAL_DISCLAIMER_TEXT}</p>
          <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/70">
            BMI screening categories referenced: Underweight (&lt;18.5), Normal (18.5–24.9), Overweight (25.0–29.9),
            Obesity (30.0+).
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="text-xs text-slate-400 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/80">
          <strong className="text-slate-200 block mb-1">Technical Architecture:</strong>
          Engineered using React, Vite, TypeScript, Canvas 2.5D rendering, Web Audio API procedural synthesis,
          and zero external audio dependencies. Fully responsive across desktop, tablet, and mobile browsers.
        </div>
      </div>
    </div>
  );
};
