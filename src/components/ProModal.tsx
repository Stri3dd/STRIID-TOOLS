import React from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck, 
  FileSearch, 
  Bot,
  UserCheck
} from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-8 shadow-2xl shadow-blue-500/10 text-left overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-gradient-to-b from-blue-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
            <Crown className="h-6 w-6 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white">Striid Pro</h2>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-300">
                LIFETIME OR MONTHLY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Unlock unlimited AI Text Humanizing, batch processing, and high-res exports.
            </p>
          </div>
        </div>

        {/* Comparison columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Free Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300">Free Forever</span>
                <span className="text-lg font-black text-white">£0</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-4">
                Generous everyday tools with zero annoying ads or popups.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% In-Browser Privacy</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>PDF Merge, Split, Rotate & Lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Image Compress & EXIF Stripper</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>UK Salary & Running Calculators</span>
                </li>
              </ul>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] font-semibold text-slate-400 text-center">
              Active by default
            </div>
          </div>

          {/* Pro Card */}
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent p-5 flex flex-col justify-between relative shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-300">Striid Pro</span>
                <div className="text-right">
                  <span className="text-lg font-black text-white">£4</span>
                  <span className="text-[11px] text-slate-400">/mo or £29 lifetime</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-200/80 mb-4">
                Power-user features for creators, writers & professionals.
              </p>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2 font-medium">
                  <UserCheck className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Unlimited AI Text Humanizer</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Bot className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>AI Document Summary & Insights</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Bulk Batch Processing (50+ files)</span>
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <FileSearch className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Ultra-Res 300 DPI Print Export</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                alert('Striid Pro integration: Connect your Stripe or LemonSqueezy payment link here!');
              }}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Crown className="h-4 w-4" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            Striid will never lock essential features behind unexpected paywalls. The free tier remains free forever.
          </span>
        </div>
      </div>
    </div>
  );
};
