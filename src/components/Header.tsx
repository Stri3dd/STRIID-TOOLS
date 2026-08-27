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
            href="#why-striid"
            className="hidden sm:inline-block text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
          >
            Why Striid?
          </a>
          <a
            href="#faq"
            className="hidden sm:inline-block text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
          >
            FAQ
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
