import React, { useState } from 'react';
import { 
  FileText, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Plus, 
  Layers, 
  Loader2, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { mergePDFs, getPdfPageCount, formatBytes } from '../utils/pdfEngine';
import type { UploadedFile } from '../types';

export const MergeTool: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-merged.pdf');

  const handleFilesAdded = async (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) return;

    const mapped: UploadedFile[] = await Promise.all(
      pdfFiles.map(async (file) => {
        let pageCount = 0;
        try {
          pageCount = await getPdfPageCount(file);
        } catch (e) {
          console.error('Error reading pages:', e);
        }
        return {
          id: Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          pageCount,
        };
      })
    );

    setFiles((prev) => [...prev, ...mapped]);
    setIsComplete(false);
    setMergedBlob(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === files.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIndex];
    newFiles[targetIndex] = temp;
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const rawFiles = files.map((f) => f.file);
      const mergedBytes = await mergePDFs(rawFiles);
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setMergedBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#10b981'],
      });
    } catch (err) {
      console.error('Merge error:', err);
      alert('An error occurred while merging PDFs. Please ensure valid PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedBlob) return;
    saveAs(mergedBlob, outputName || 'striid-merged.pdf');
  };

  const resetAll = () => {
    setFiles([]);
    setIsComplete(false);
    setMergedBlob(null);
  };

  const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Layers className="h-3.5 w-3.5" />
          <span>Merge PDF Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Merge PDF Files Instantly
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Combine multiple PDF documents into a single organized file in seconds. Drag to reorder. 100% processed in your browser.
        </p>
      </div>

      {files.length === 0 ? (
        <DropZone
          onFilesSelected={handleFilesAdded}
          title="Select or drop PDF files to merge"
          subtitle="Choose 2 or more PDF files from your computer"
          accept=".pdf,application/pdf"
        />
      ) : isComplete && mergedBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Your PDF is Ready!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Combined {files.length} PDFs into a single {totalPages} page document ({formatBytes(mergedBlob.size)}).
          </p>

          <div className="mt-6 max-w-sm mx-auto flex items-center gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2 text-left">
            <FileText className="h-5 w-5 text-blue-400 shrink-0 ml-2" />
            <input
              type="text"
              value={outputName}
              onChange={(e) => setOutputName(e.target.value)}
              className="bg-transparent text-xs font-medium text-white focus:outline-none w-full"
              placeholder="filename.pdf"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download Merged PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Merge More Files
            </button>
          </div>
        </div>
      ) : (
        /* File Management & Reorder State */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Files to Combine</h3>
              <p className="text-xs text-slate-400">
                {files.length} files • {totalPages} total pages • {formatBytes(totalSize)}
              </p>
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Add More</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFilesAdded(Array.from(e.target.files));
                }}
              />
            </label>
          </div>

          {/* Reorderable file list */}
          <div className="space-y-2.5">
            {files.map((file, idx) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 transition-colors hover:border-slate-700"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 font-bold text-xs border border-blue-500/20">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {file.pageCount ? `${file.pageCount} pages` : 'Reading...'} • {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1}
                    title="Move Down"
                    className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    title="Remove"
                    className="p-1.5 text-red-400/80 hover:text-red-400 transition-colors ml-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <button
              onClick={resetAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear all files
            </button>
            <button
              onClick={handleMerge}
              disabled={isProcessing || files.length < 2}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Merging PDFs in Browser...</span>
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4" />
                  <span>Merge {files.length} Files Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
