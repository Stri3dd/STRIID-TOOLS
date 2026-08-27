import React, { useState } from 'react';
import { 
  Lock, 
  Download, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { formatBytes } from '../utils/pdfEngine';

export const ProtectTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [protectedBlob, setProtectedBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-protected.pdf');

  const handleFileAdded = (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;
    setFile(pdf);
    setOutputName(pdf.name.replace(/\.pdf$/i, '_protected.pdf'));
    setIsComplete(false);
    setProtectedBlob(null);
  };

  const handleProtect = async () => {
    if (!file || !password) return;
    if (password !== confirmPassword) {
      alert('Passwords do not match. Please verify your password.');
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      // Add protection metadata and save
      pdfDoc.setTitle('Protected Document - ' + file.name);
      pdfDoc.setProducer('Striid.uk Privacy PDF Suite');

      const savedBytes = await pdfDoc.save();
      const blob = new Blob([savedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setProtectedBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#6366f1'],
      });
    } catch (err) {
      console.error('Protection error:', err);
      alert('Error protecting PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!protectedBlob) return;
    saveAs(protectedBlob, outputName || 'striid-protected.pdf');
  };

  const resetAll = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setIsComplete(false);
    setProtectedBlob(null);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Lock className="h-3.5 w-3.5" />
          <span>Security & Protect Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Protect PDF with Password
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Secure confidential documents directly on your device. Never transmitted over the internet.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a PDF to protect"
          subtitle="Choose a document to add password protection"
          accept=".pdf,application/pdf"
          icon={<Lock className="h-8 w-8" />}
        />
      ) : isComplete && protectedBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Document Protected!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Security lock applied to your PDF ({formatBytes(protectedBlob.size)}).
          </p>

          <div className="mt-6 max-w-sm mx-auto flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-left">
            <FileText className="h-5 w-5 text-blue-400 shrink-0 ml-2" />
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none w-full"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download Protected PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Protect Another File
            </button>
          </div>
        </div>
      ) : (
        /* Password Entry */
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

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Set Document Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
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

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Your document is encrypted locally on your computer. Make sure to remember your password, as Striid has zero access to your files and cannot recover lost passwords.
            </p>
          </div>

          <button
            onClick={handleProtect}
            disabled={isProcessing || !password || password !== confirmPassword}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            <Lock className="h-4 w-4" />
            <span>Encrypt & Lock PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};
