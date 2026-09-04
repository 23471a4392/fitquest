import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 px-4 text-xs text-slate-500 mt-auto select-none">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Medical disclaimer note */}
        <div className="flex items-start gap-2 max-w-xl text-left">
          <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-500/80" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong className="text-slate-300">Disclaimer: </strong>
            FitQuest is an educational fitness entertainment application. BMI is a general screening
            benchmark, not a medical diagnosis.{' '}
            <button
              onClick={onOpenAbout}
              className="text-lime-400 underline hover:text-lime-300"
            >
              Read full medical notice
            </button>
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={onOpenHowToPlay} className="hover:text-lime-400 transition">
            How to Play
          </button>
          <span>•</span>
          <button onClick={onOpenAbout} className="hover:text-lime-400 transition">
            Science & About
          </button>
          <span>•</span>
          <button onClick={onOpenSettings} className="hover:text-lime-400 transition">
            Settings
          </button>
        </div>
      </div>
    </footer>
  );
};
