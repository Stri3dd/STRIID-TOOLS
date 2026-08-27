import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import type { ToolId } from '../types';

interface FooterProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, onOpenPro, onOpenLegal }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              STRII<span className="text-blue-500">D</span>.UK
            </span>
          </div>
          <p className="text-slate-500 text-[11px] text-center md:text-left">
            100% In-Browser Client-Side Tools. Built for speed, privacy, and zero bloat.
          </p>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button onClick={() => onSelectTool('merge')} className="hover:text-white transition-colors">
            Merge PDF
          </button>
          <button onClick={() => onSelectTool('ai-humanizer')} className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
            AI Humanizer
          </button>
          <button onClick={() => onSelectTool('img-compress')} className="hover:text-white transition-colors">
            Compress Images
          </button>
          <button onClick={() => onSelectTool('uk-salary')} className="hover:text-white transition-colors">
            UK Salary
          </button>
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-white transition-colors">
            Privacy Policy (GDPR)
          </button>
          <button onClick={() => onOpenLegal('terms')} className="hover:text-white transition-colors">
            Terms of Service
          </button>
          <button onClick={onOpenPro} className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
            Striid Pro
          </button>
        </div>

        {/* Security / region tag & Open Source */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Zero Server Uploads • UK GDPR Compliant</span>
          </div>
          <a
            href="https://github.com/Stri3dd/STRIID-TOOLS"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <span>• MIT Open Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
