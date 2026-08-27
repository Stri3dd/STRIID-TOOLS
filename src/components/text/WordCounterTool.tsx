import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Mic, 
  Copy, 
  Check, 
  Trash2 
} from 'lucide-react';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) || []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

  const readingTimeSec = Math.ceil((words / 225) * 60);
  const speakingTimeSec = Math.ceil((words / 140) * 60);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <FileText className="h-3.5 w-3.5" />
          <span>Writing & Content Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Word & Character Counter
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Accurate real-time statistics, reading time estimators, and sentence metrics.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white">{words}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Words</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-blue-400">{charsWithSpaces}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Characters</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white">{sentences}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Sentences</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <p className="text-2xl sm:text-3xl font-black text-white">{paragraphs}</p>
          <p className="text-xs text-slate-400 font-semibold mt-1">Paragraphs</p>
        </div>
      </div>

      {/* Main Text Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              Reading: <b className="text-slate-200">{formatTime(readingTimeSec)}</b>
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-indigo-400" />
              Speaking: <b className="text-slate-200">{formatTime(speakingTimeSec)}</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyText}
              disabled={!text}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white disabled:opacity-30"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="flex items-center gap-1 text-xs text-red-400/80 hover:text-red-400 disabled:opacity-30 ml-2"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here to analyze..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-y leading-relaxed font-sans"
        />

        <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Chars (no spaces): {charsNoSpaces}</span>
          <span>100% processed locally</span>
        </div>
      </div>
    </div>
  );
};
