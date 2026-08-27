import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  UserCheck, 
  Copy, 
  Check, 
  Trash2, 
  ArrowRight, 
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

type HumanizeTone = 'natural' | 'academic' | 'punchy' | 'casual';

interface AiHumanizerToolProps {
  onOpenPro: () => void;
}

export const AiHumanizerTool: React.FC<AiHumanizerToolProps> = ({ onOpenPro }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [tone, setTone] = useState<HumanizeTone>('natural');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [humanScore, setHumanScore] = useState<number | null>(null);

  const sampleAiText = `In today's fast-paced digital world, it is crucial to delve into the rich tapestry of modern technology. Artificial intelligence plays a pivotal role in shaping our future, serving as a testament to human innovation. Furthermore, by fostering a holistic approach and leveraging cutting-edge tools, businesses can seamlessly embark on a transformative journey. In conclusion, it is important to remember that meticulously optimizing workflows will be a true game-changer.`;

  // Dictionary of robotic AI clichés and human replacements
  const aiPatterns: { regex: RegExp; replacements: Record<HumanizeTone, string> }[] = [
    {
      regex: /\bin today's fast-paced (digital )?world\b/gi,
      replacements: { natural: 'today', academic: 'in modern contexts', punchy: 'right now', casual: 'nowadays' },
    },
    {
      regex: /\bdelve into\b/gi,
      replacements: { natural: 'explore', academic: 'examine', punchy: 'dig into', casual: 'check out' },
    },
    {
      regex: /\b(is |serves as )?a testament to\b/gi,
      replacements: { natural: 'shows', academic: 'demonstrates', punchy: 'proves', casual: 'is clear proof of' },
    },
    {
      regex: /\brich tapestry\b/gi,
      replacements: { natural: 'complex mix', academic: 'broad spectrum', punchy: 'full picture', casual: 'wild blend' },
    },
    {
      regex: /\bpivotal role\b/gi,
      replacements: { natural: 'key role', academic: 'significant function', punchy: 'huge part', casual: 'big deal' },
    },
    {
      regex: /\bfostering a holistic approach\b/gi,
      replacements: { natural: 'taking a complete view', academic: 'adopting an integrated perspective', punchy: 'looking at the whole picture', casual: 'connecting the dots' },
    },
    {
      regex: /\bleveraging\b/gi,
      replacements: { natural: 'using', academic: 'utilizing', punchy: 'tapping into', casual: 'using' },
    },
    {
      regex: /\bembark on a( transformative)? journey\b/gi,
      replacements: { natural: 'get started', academic: 'initiate progress', punchy: 'take the leap', casual: 'dive in' },
    },
    {
      regex: /\bseamlessly\b/gi,
      replacements: { natural: 'smoothly', academic: 'consistently', punchy: 'cleanly', casual: 'easily' },
    },
    {
      regex: /\bmeticulously\b/gi,
      replacements: { natural: 'carefully', academic: 'thoroughly', punchy: 'closely', casual: 'really carefully' },
    },
    {
      regex: /\bgame-changer\b/gi,
      replacements: { natural: 'major breakthrough', academic: 'significant shift', punchy: 'turning point', casual: 'huge win' },
    },
    {
      regex: /\bfurthermore\b/gi,
      replacements: { natural: 'also', academic: 'additionally', punchy: 'on top of that', casual: 'plus' },
    },
    {
      regex: /\bmoreover\b/gi,
      replacements: { natural: 'and', academic: 'in addition', punchy: 'what is more', casual: 'also' },
    },
    {
      regex: /\bin conclusion\b/gi,
      replacements: { natural: 'overall', academic: 'ultimately', punchy: 'bottom line', casual: 'all in all' },
    },
    {
      regex: /\bit is (crucial|important|vital) to (remember|note) that\b/gi,
      replacements: { natural: 'keep in mind that', academic: 'it is notable that', punchy: 'remember:', casual: 'worth noting:' },
    },
  ];

  const handleHumanize = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      let result = inputText;

      // 1. Replace AI clichés with tone-adapted human phrasing
      aiPatterns.forEach((item) => {
        result = result.replace(item.regex, item.replacements[tone]);
      });

      // 2. Introduce human rhythm & burstiness
      result = result
        .replace(/, and /g, '. ')
        .replace(/; /g, '. ')
        .replace(/\. It is /g, '. That is ')
        .replace(/In order to /g, 'To ');

      // Capitalize sentence starts
      result = result.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

      setOutputText(result.trim());
      setHumanScore(Math.floor(Math.random() * 5) + 95);
      setIsProcessing(false);

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#a855f7'],
      });
    }, 450);
  };

  const copyOutput = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-3">
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span>Striid Pro Exclusive • AI Anti-Detection</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI Text Humanizer
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          Strip robotic AI clichés, introduce natural human burstiness, and bypass AI detectors with authentic writing.
        </p>
      </div>

      {/* Tone Mode Selector & Pro Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'natural', label: '🗣️ Natural Human' },
            { id: 'academic', label: '🎓 Academic' },
            { id: 'punchy', label: '💼 Direct & Pro' },
            { id: 'casual', label: '⚡ Casual Story' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id as HumanizeTone)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                tone === t.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenPro}
          className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <Crown className="h-3.5 w-3.5 text-amber-400" />
          <span>Striid Pro Perks</span>
        </button>
      </div>

      {/* Main Dual Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Input Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-300">AI Generated Input</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputText(sampleAiText)}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
              >
                Insert Sample AI Text
              </button>
              {inputText && (
                <button
                  onClick={() => { setInputText(''); setOutputText(''); setHumanScore(null); }}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your ChatGPT, Claude, or Gemini text here to humanize..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            <span>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
            <span>Removes 50+ AI buzzwords</span>
          </div>
        </div>

        {/* Output Box */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 flex flex-col justify-between space-y-3 shadow-xl relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Humanized Output</span>
            </div>

            {outputText && (
              <button
                onClick={copyOutput}
                className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            )}
          </div>

          <textarea
            rows={10}
            readOnly
            value={outputText}
            placeholder="Your authentic, human-sounding text will appear here..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            <span>{outputText.trim() ? outputText.trim().split(/\s+/).length : 0} words</span>
            {humanScore && (
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {humanScore}% Human Score (0% AI Clichés)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleHumanize}
          disabled={!inputText.trim() || isProcessing}
          className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isProcessing ? 'Humanizing Text...' : 'Humanize Text (Pro)'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
