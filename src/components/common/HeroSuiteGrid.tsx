import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ALL_TOOLS } from '../ToolNavigation';
import { CATEGORIES } from './CategoryTabs';
import type { ToolId, ToolCategory } from '../../types';

interface HeroSuiteGridProps {
  onSelectTool: (id: ToolId) => void;
  onSelectCategory: (cat: ToolCategory) => void;
}

export const HeroSuiteGrid: React.FC<HeroSuiteGridProps> = ({
  onSelectTool,
  onSelectCategory,
}) => {
  return (
    <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>The All-In-One Privacy Toolkit</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Explore All Tool Suites on Striid
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Fast, client-side, zero-upload tools designed for productivity, security, and everyday utility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const catTools = ALL_TOOLS.filter((t) => t.category === cat.id);
          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                    {catTools.length} Tools
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">{cat.shortDesc}</p>

                <div className="space-y-2">
                  {catTools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => onSelectTool(tool.id)}
                      className="w-full flex items-center justify-between text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-blue-600/10 hover:border-blue-500/30 border border-slate-800/80 transition-all text-xs group/item"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-slate-200 block truncate group-hover/item:text-blue-400">
                          {tool.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {tool.shortDesc}
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover/item:text-blue-400 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectCategory(cat.id);
                  if (catTools[0]) onSelectTool(catTools[0].id);
                }}
                className="mt-5 w-full text-center text-xs font-bold text-blue-400 hover:text-blue-300 py-1"
              >
                View full {cat.name} →
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
