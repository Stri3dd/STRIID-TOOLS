import React, { useState } from 'react';
import { 
  Unlock, 
  Download, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RefreshCw,
  FileText,
  Loader2,
  Lock,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import * as pdfjsLib from 'pdfjs-dist';
import { DropZone } from './DropZone';
import { unlockPDF, formatBytes } from '../utils/pdfEngine';

export const UnlockTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [unlockedBlob, setUnlockedBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-unlocked.pdf');
  const [errorMsg, setErrorMsg] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);

  const handleFileAdded = async (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;

    setFile(pdf);
    setOutputName(pdf.name.replace(/\.pdf$/i, '_unlocked.pdf'));
    setIsComplete(false);
    setUnlockedBlob(null);
    setErrorMsg('');
    setPassword('');

    // Pre-test if the PDF has an open password lock or just owner permissions
    try {
      const buffer = await pdf.arrayBuffer();
      const testTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        password: '',
      });
      await testTask.promise;
      // Opens with empty password -> only owner restrictions or already open
      setNeedsPassword(false);
    } catch (err: any) {
      if (err?.name === 'PasswordException') {
        setNeedsPassword(true);
      }
    }
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const unlockedBytes = await unlockPDF(file, password);
      const blob = new Blob([unlockedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setUnlockedBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch (err: any) {
      console.error('Unlock error:', err);
      if (err?.name === 'PasswordException' || err?.message?.includes('password') || err?.message?.includes('Password')) {
        setErrorMsg('Incorrect password. Please verify the password and try again.');
      } else {
        setErrorMsg('Could not decrypt this file. If it is password protected, please enter the password above.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!unlockedBlob) return;
    saveAs(unlockedBlob, outputName || 'striid-unlocked.pdf');
  };

  const resetAll = () => {
    setFile(null);
    setPassword('');
    setErrorMsg('');
    setIsComplete(false);
    setUnlockedBlob(null);
    setNeedsPassword(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Unlock className="h-3.5 w-3.5" />
          <span>Unlock & Decrypt Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Unlock Password-Protected PDF
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Permanently remove password encryption and editing restrictions from your PDF files directly in your browser.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a locked PDF to unlock"
          subtitle="Choose an encrypted or password-protected document"
          accept=".pdf,application/pdf"
          icon={<Lock className="h-8 w-8 text-amber-400" />}
        />
      ) : isComplete && unlockedBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">PDF Decrypted & 100% Unlocked!</h2>
            <p className="mt-1 text-sm text-slate-400">
              All password protection and editing restrictions have been permanently stripped ({formatBytes(unlockedBlob.size)}).
            </p>
          </div>

          <div className="max-w-sm mx-auto flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-left">
            <FileText className="h-5 w-5 text-blue-400 shrink-0 ml-2" />
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download Unlocked PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Unlock Another File
            </button>
          </div>
        </div>
      ) : (
        /* Password Entry & Unlock Form */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-sm font-bold text-white">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
            <button
              onClick={resetAll}
              className="text-xs text-slate-400 hover:text-white"
            >
              Change file
            </button>
          </div>

          {needsPassword ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-300">Document Open Password Required</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  This document is AES encrypted. Please enter its password below once so we can decrypt and remove the password forever.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-300">Ready to Unlock Instantly</p>
                <p className="text-[11px] text-emerald-200/80 mt-0.5">
                  No open password required. Click the button below to strip all printing, copying, and permissions locks.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {needsPassword ? 'Enter Password to Decrypt:' : 'Password (optional if known):'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={needsPassword ? 'Enter the password' : 'Leave blank if not known'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Decryption runs 100% in your browser. Your document and password are never transmitted over the network.
            </p>
          </div>

          <button
            onClick={handleUnlock}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Decrypting & Removing Password Lock...</span>
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                <span>Unlock & Decrypt PDF</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
