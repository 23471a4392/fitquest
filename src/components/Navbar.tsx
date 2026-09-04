import React from 'react';
import type { PlayerProfile } from '../types/game';
import { Volume2, VolumeX, Music, User, Trophy, Calendar, Award, BarChart2, Settings, HelpCircle } from 'lucide-react';

interface NavbarProps {
  player: PlayerProfile | null;
  activeScreen: string;
  soundEnabled: boolean;
  musicEnabled: boolean;
  onNavigate: (screen: string) => void;
  onToggleSound: () => void;
  onToggleMusic: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  player,
  activeScreen,
  soundEnabled,
  musicEnabled,
  onNavigate,
  onToggleSound,
  onToggleMusic,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-lime-500/25 px-4 py-2.5 shadow-lg select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('welcome')}
          className="flex items-center gap-2 group text-left"
        >
          <div className="w-8 h-8 rounded-xl bg-lime-500/20 border border-lime-500/50 flex items-center justify-center text-lg group-hover:scale-105 transition shadow-sm shadow-lime-500/30">
            🏃
          </div>
          <div>
            <span className="font-black text-base tracking-tight text-slate-100">
              FIT<span className="text-lime-400">QUEST</span>
            </span>
            <span className="hidden sm:block text-[9px] font-bold text-lime-400/80 tracking-widest uppercase">
              Eat Smart • Run Strong
            </span>
          </div>
        </button>

        {/* Navigation Icons (Desktop/Tablet) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-800">
          {[
            { id: 'welcome', label: 'Home' },
            { id: 'level_select', label: 'Levels' },
            { id: 'daily_challenges', label: 'Daily', icon: <Calendar size={13} /> },
            { id: 'achievements', label: 'Badges', icon: <Award size={13} /> },
            { id: 'leaderboard', label: 'Rankings', icon: <Trophy size={13} /> },
            { id: 'statistics', label: 'Stats', icon: <BarChart2 size={13} /> },
            { id: 'how_to_play', label: 'Guide', icon: <HelpCircle size={13} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeScreen === item.id
                  ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Controls: Audio & Profile */}
        <div className="flex items-center gap-2">
          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-lime-500/20 border-lime-500/40 text-lime-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Mute SFX' : 'Enable SFX'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Synth Music Toggle */}
          <button
            onClick={onToggleMusic}
            className={`p-2 rounded-xl border transition ${
              musicEnabled
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-sm animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={musicEnabled ? 'Stop Workout Music' : 'Play Workout Music'}
          >
            <Music size={16} />
          </button>

          {/* Settings */}
          <button
            onClick={() => onNavigate('settings')}
            className={`p-2 rounded-xl border transition ${
              activeScreen === 'settings'
                ? 'bg-lime-500/20 border-lime-500/40 text-lime-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Settings"
          >
            <Settings size={16} />
          </button>

          {/* Active Player Profile Button */}
          <button
            onClick={() => onNavigate('player_setup')}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-lime-500/30 hover:border-lime-500 text-xs font-bold text-slate-200 transition"
          >
            <div className="w-6 h-6 rounded-lg bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400 text-xs">
              {player ? player.name.charAt(0).toUpperCase() : <User size={12} />}
            </div>
            <span className="hidden sm:inline">{player ? player.name : 'Create Runner'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
