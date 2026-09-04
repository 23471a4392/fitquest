import React, { useState } from 'react';
import type { GameSettings } from '../types/game';
import { Volume2, VolumeX, Music, Moon, Sun, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react';
import { soundEngine } from '../utils/audioSystem';

interface SettingsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onResetData: () => void;
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetData,
  onBack,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const toggleSound = () => {
    const updated = !settings.soundEnabled;
    soundEngine.setSoundEnabled(updated);
    onUpdateSettings({ ...settings, soundEnabled: updated });
  };

  const toggleMusic = () => {
    const updated = !settings.musicEnabled;
    soundEngine.setMusicEnabled(updated);
    onUpdateSettings({ ...settings, musicEnabled: updated });
  };

  const handleVolumeChange = (vol: number) => {
    soundEngine.setMasterVolume(vol);
    onUpdateSettings({ ...settings, soundVolume: vol });
  };

  const setDifficulty = (diff: 'casual' | 'normal' | 'pro') => {
    onUpdateSettings({ ...settings, difficulty: diff });
  };

  const toggleAnimations = () => {
    onUpdateSettings({ ...settings, animationsEnabled: !settings.animationsEnabled });
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ ...settings, theme: newTheme });
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4 animate-fade-in flex flex-col gap-6">
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">Game Settings</h1>
          <p className="text-xs text-slate-400">Audio, graphics & difficulty preferences</p>
        </div>

        <div className="w-16" />
      </div>

      {/* Settings Panel */}
      <div className="bg-slate-900/90 border border-lime-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-5">
        {/* 1. Audio FX */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400">
              {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 block">Sound Effects</span>
              <span className="text-xs text-slate-400">Pickup chimes, crashes & power-up sounds</span>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              settings.soundEnabled ? 'bg-lime-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* 2. Workout Synth Beat Music */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Music size={20} />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 block">Workout Synth Beat</span>
              <span className="text-xs text-slate-400">Procedural 142 BPM athletic rhythm engine</span>
            </div>
          </div>

          <button
            onClick={toggleMusic}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              settings.musicEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="py-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>Master Volume</span>
            <span className="font-bold text-lime-400">{Math.round(settings.soundVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.soundVolume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-lime-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 3. Difficulty */}
        <div className="py-3 border-b border-slate-800">
          <span className="font-extrabold text-sm text-slate-100 block mb-1">Game Difficulty</span>
          <span className="text-xs text-slate-400 block mb-2.5">
            Adjusts running tempo, reaction windows, and hazard spawn frequencies
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'casual', label: 'Casual', desc: 'Slower tempo' },
              { id: 'normal', label: 'Normal', desc: 'Balanced' },
              { id: 'pro', label: 'Pro Athlete', desc: 'Fast & demanding' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id as 'casual' | 'normal' | 'pro')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  settings.difficulty === d.id
                    ? 'bg-lime-500/20 border-lime-400 text-lime-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold">{d.label}</div>
                <div className="text-[10px] text-slate-500">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Motion / Animations */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div>
            <span className="font-extrabold text-sm text-slate-100 block">Dynamic Screen Animations</span>
            <span className="text-xs text-slate-400">Screen shake on impacts & floating text floaters</span>
          </div>

          <button
            onClick={toggleAnimations}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
              settings.animationsEnabled ? 'bg-lime-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-slate-950 shadow-md" />
          </button>
        </div>

        {/* 5. Theme: Athletic Dark vs Clean Light */}
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              {settings.theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-100 block">Visual Style Theme</span>
              <span className="text-xs text-slate-400">
                {settings.theme === 'dark' ? 'Athletic Obsidian & Emerald' : 'Clean Warm Ivory & Lime'}
              </span>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition"
          >
            {settings.theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* 6. Reset Game Data */}
        <div className="pt-2">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-3 px-4 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <RotateCcw size={15} />
              <span>Reset All Saved Game Data</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col gap-3">
              <div className="flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle size={18} className="shrink-0 text-rose-400" />
                <p>
                  Are you sure? This will wipe your profile, leaderboard records, daily challenge progress,
                  and unlocked achievements.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onResetData();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
