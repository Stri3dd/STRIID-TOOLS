import React, { useState } from 'react';
import { Type, Copy, Check, Trash2 } from 'lucide-react';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toPascalCase = (str: string) => {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const conversions = [
    { id: 'upper', name: 'UPPERCASE', transform: (s: string) => s.toUpperCase() },
    { id: 'lower', name: 'lowercase', transform: (s: string) => s.toLowerCase() },
    { id: 'title', name: 'Title Case', transform: toTitleCase },
    { id: 'sentence', name: 'Sentence case', transform: toSentenceCase },
    { id: 'camel', name: 'camelCase', transform: toCamelCase },
    { id: 'pascal', name: 'PascalCase', transform: toPascalCase },
    { id: 'snake', name: 'snake_case', transform: toSnakeCase },
    { id: 'kebab', name: 'kebab-case', transform: toKebabCase },
    { id: 'constant', name: 'CONSTANT_CASE', transform: toConstantCase },
  ];

  const handleApply = (transform: (s: string) => string) => {
    setText(transform(text));
  };

  const copyTransformed = (id: string, transform: (s: string) => string) => {
    const result = transform(text);
    navigator.clipboard.writeText(result);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Type className="h-3.5 w-3.5" />
          <span>Formatting Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Case Converter
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Convert text between camelCase, Title Case, UPPERCASE, kebab-case, snake_case, and more.
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-6 space-y-4 mb-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-300">Your Text</span>
          <button
            onClick={() => setText('')}
            disabled={!text}
            className="flex items-center gap-1 text-xs text-red-400/80 hover:text-red-400 disabled:opacity-30"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste text here to convert casing..."
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-y leading-relaxed font-sans"
        />
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {conversions.map((conv) => (
          <div
            key={conv.id}
            className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-300">{conv.name}</span>
                <button
                  onClick={() => copyTransformed(conv.id, conv.transform)}
                  disabled={!text}
                  className="text-slate-400 hover:text-white disabled:opacity-30 p-1"
                >
                  {copiedId === conv.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
              <p className="text-xs font-mono text-slate-400 truncate bg-slate-950/60 rounded p-2 border border-slate-800/80">
                {text ? conv.transform(text) : conv.name}
              </p>
            </div>

            <button
              onClick={() => handleApply(conv.transform)}
              disabled={!text}
              className="mt-3 w-full rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 text-[11px] font-bold py-1.5 transition-colors disabled:opacity-30"
            >
              Apply to Input
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
