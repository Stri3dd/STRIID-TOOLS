import React from 'react';
import { ShieldCheck, Zap, Sparkles, Crown } from 'lucide-react';
import type { ToolId } from '../types';

interface HeaderProps {
  currentTool: ToolId;
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPro }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 text-left group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black tracking-tight text-xl text-white">
              STRII<span className="text-blue-500">D</span>
              <span className="rounded bg-blue-950/80 border border-blue-800/50 px-1.5 py-0.5 text-[10px] font-bold text-blue-400">
                .UK
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">100% Private PDF Suite</p>
          </div>
        </a>

        {/* Center Privacy Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs text-emerald-400 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold">Zero-Upload:</span> Files never leave your browser
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Stri3dd/STRIID-TOOLS"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="hidden sm:inline">Open Source</span>
          </a>
          <button
            onClick={onOpenPro}
            className="group flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition-all shadow-sm hover:border-amber-500/60"
          >
            <Crown className="h-3.5 w-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Striid Pro</span>
            <Sparkles className="h-3 w-3 text-amber-400 opacity-75" />
          </button>
        </div>
      </div>
    </header>
  );
};
