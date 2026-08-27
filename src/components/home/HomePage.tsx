import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Crown, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { ALL_TOOLS } from '../ToolNavigation';
import type { ToolId, ToolCategory } from '../../types';

interface HomePageProps {
  onSelectTool: (id: ToolId) => void;
  onOpenPro: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 backdrop-blur-sm shadow-sm">
            <Zap className="h-3.5 w-3.5 fill-blue-400" />
            <span>100% In-Browser • Zero Server Uploads</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>UK GDPR Compliant</span>
          </div>
          <a
            href="https://github.com/Stri3dd/STRIID-TOOLS"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <span>⭐ MIT Open Source</span>
          </a>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Everyday Digital Tools. <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Zero Data Risk.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Merge PDFs, compress photos, humanize AI writing, and calculate UK tax locally in your browser. 
          No paywalls, no countdown timers, and zero file uploads.
        </p>

        {/* Universal Search Bar */}
        <div className="mt-10 max-w-2xl mx-auto relative group">
          <div className="relative flex items-center rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all backdrop-blur-md">
            <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 18+ tools (e.g. Merge PDF, AI Humanizer, Compress, Salary)..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 font-semibold">Popular:</span>
            {[
              { id: 'ai-humanizer' as ToolId, label: '🤖 AI Humanizer', color: 'text-purple-400 border-purple-500/30' },
              { id: 'merge' as ToolId, label: '📄 Merge PDF', color: 'text-blue-400 border-blue-500/30' },
              { id: 'img-compress' as ToolId, label: '🖼️ Compress Images', color: 'text-emerald-400 border-emerald-500/30' },
              { id: 'uk-salary' as ToolId, label: '💷 UK Take-Home Pay', color: 'text-amber-400 border-amber-500/30' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => onSelectTool(pill.id)}
                className={`rounded-full border bg-slate-900/80 px-3 py-1 font-semibold hover:bg-slate-800 transition-all ${pill.color}`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS & ARCHITECTURE BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-white">100%</p>
            <p className="text-xs text-slate-400 font-bold mt-1">In-Browser Execution</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-emerald-400">0 KB</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Server Data Storage</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-blue-400">18+</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Free Instant Tools</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-purple-400">£0</p>
            <p className="text-xs text-slate-400 font-bold mt-1">Free Tier Forever</p>
          </div>
        </div>
      </section>

      {/* 3. TOOL SUITE CATALOG */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">All Tool Suites</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click any tool to launch it instantly</p>
          </div>

          {/* Category Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {[
              { id: 'all' as ToolCategory, label: 'All' },
              { id: 'pdf' as ToolCategory, label: '📄 PDF' },
              { id: 'image' as ToolCategory, label: '🖼️ Image' },
              { id: 'text' as ToolCategory, label: '✍️ Text & AI' },
              { id: 'security' as ToolCategory, label: '🔒 Security' },
              { id: 'uk-lifestyle' as ToolCategory, label: '🇬🇧 UK & Sport' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 flex flex-col justify-between text-left hover:border-slate-600 hover:bg-slate-900 transition-all group hover:scale-[1.02] shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-blue-400 group-hover:text-white group-hover:bg-blue-600 transition-all">
                    {tool.isPro ? (
                      <Crown className="h-5 w-5 text-amber-400 group-hover:text-slate-950" />
                    ) : tool.badge === 'HOT' ? (
                      <Sparkles className="h-5 w-5 text-purple-400 group-hover:text-white" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>

                  {tool.badge && (
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      tool.badge === 'PRO'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-1 text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
                <span>Launch Tool</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. PRIVACY VISUALIZER SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-xl text-left space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Zero-Knowledge Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why 100% In-Browser Execution Matters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              When you upload a confidential contract or tax document to traditional converter websites, it gets copied to third-party cloud servers. 
              Striid operates entirely inside your device&apos;s volatile RAM using high-performance WebAssembly. When you close the tab, zero trace remains.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No Cloud Uploads
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No Third-Party Cookies
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                MIT Open-Source Verified
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
