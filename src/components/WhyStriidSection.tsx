import React from 'react';
import { ShieldCheck, Zap, Sparkles, Check, X } from 'lucide-react';

export const WhyStriidSection: React.FC = () => {
  return (
    <section id="why-striid" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>The Privacy Standard</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Why Choose Striid Over Other Tools?
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Most online PDF converters upload your confidential bank statements, contracts, and IDs to foreign servers. Striid operates 100% inside your browser.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Zero-Upload Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your files never touch our servers. All PDF rendering and page manipulation runs client-side with WebAssembly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Instant Execution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No uploading or downloading delays. Files are processed at the speed of your computer’s processor.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No Annoying Popups</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No paywall screens blocking your download, no daily 2-file quotas, and no watermarks stamped onto your work.
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <th className="py-4 px-6 font-semibold">Feature</th>
              <th className="py-4 px-6 font-bold text-blue-400 bg-blue-950/30">STRII⚡D (.UK)</th>
              <th className="py-4 px-6 font-semibold">iLovePDF</th>
              <th className="py-4 px-6 font-semibold">Smallpdf</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            <tr>
              <td className="py-3.5 px-6 font-medium">100% In-Browser (Zero Server Upload)</td>
              <td className="py-3.5 px-6 font-bold text-emerald-400 bg-blue-950/20 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Yes (100% Private)
              </td>
              <td className="py-3.5 px-6 text-red-400">
                <X className="h-4 w-4 inline mr-1" /> Uploads to Cloud
              </td>
              <td className="py-3.5 px-6 text-red-400">
                <X className="h-4 w-4 inline mr-1" /> Uploads to Cloud
              </td>
            </tr>
            <tr>
              <td className="py-3.5 px-6 font-medium">Daily Free File Limit</td>
              <td className="py-3.5 px-6 font-bold text-emerald-400 bg-blue-950/20">
                Unlimited
              </td>
              <td className="py-3.5 px-6 text-slate-400">Limited (Paywall)</td>
              <td className="py-3.5 px-6 text-slate-400">2 files / day</td>
            </tr>
            <tr>
              <td className="py-3.5 px-6 font-medium">Full Page Visual Reorder & Rotate</td>
              <td className="py-3.5 px-6 font-bold text-emerald-400 bg-blue-950/20">
                <Check className="h-4 w-4 inline mr-1" /> Free & Instant
              </td>
              <td className="py-3.5 px-6 text-slate-400">Basic</td>
              <td className="py-3.5 px-6 text-slate-400">Requires Account</td>
            </tr>
            <tr>
              <td className="py-3.5 px-6 font-medium">Intrusive Popups & Ads</td>
              <td className="py-3.5 px-6 font-bold text-emerald-400 bg-blue-950/20">
                <Check className="h-4 w-4 inline mr-1" /> Zero Popups
              </td>
              <td className="py-3.5 px-6 text-slate-400">Heavy ads</td>
              <td className="py-3.5 px-6 text-slate-400">Aggressive upsells</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};
