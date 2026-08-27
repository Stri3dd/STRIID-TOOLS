import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let chars = '';
    if (useUpper) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (useLower) chars += 'abcdefghijkmnopqrstuvwxyz';
    if (useNumbers) chars += '23456789';
    if (useSymbols) chars += '!@#$%^&*()_+~|}{[]:;?><,.-=';

    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (useUpper && useLower) score += 1;
    if (useNumbers && useSymbols) score += 1;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
    if (score === 2) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400' };
    if (score === 3) return { label: 'Strong', color: 'bg-blue-500', text: 'text-blue-400' };
    return { label: 'Unbreakable', color: 'bg-emerald-500', text: 'text-emerald-400' };
  };

  const strength = getStrength();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <KeyRound className="h-3.5 w-3.5" />
          <span>Security & Cryptography Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Strong Password Generator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Generate cryptographically secure passwords locally in your browser using hardware-grade randomness.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
        {/* Output Box */}
        <div className="relative flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 p-4">
          <span className="font-mono text-lg sm:text-xl font-bold text-white break-all pr-12">
            {password}
          </span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <button
              onClick={generatePassword}
              title="Regenerate"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={copyPassword}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-400">Password Entropy Strength:</span>
            <span className={`font-bold ${strength.text}`}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${strength.color}`}
              style={{
                width:
                  strength.label === 'Weak'
                    ? '25%'
                    : strength.label === 'Medium'
                    ? '50%'
                    : strength.label === 'Strong'
                    ? '75%'
                    : '100%',
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 pt-2">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Password Length:</span>
              <span className="text-blue-400 font-mono text-sm">{length} characters</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: 'Uppercase (A-Z)', state: useUpper, set: setUseUpper },
              { label: 'Lowercase (a-z)', state: useLower, set: setUseLower },
              { label: 'Numbers (0-9)', state: useNumbers, set: setUseNumbers },
              { label: 'Symbols (!@#$)', state: useSymbols, set: setUseSymbols },
            ].map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => opt.set(!opt.state)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  opt.state
                    ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>{opt.label}</span>
                  <span>{opt.state ? '✓' : ''}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
