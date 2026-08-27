import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Download, 
  Loader2, 
  CheckCircle2, 
  RefreshCw, 
  FileText,
  Undo2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { 
  renderPageThumbnails, 
  reorderAndRotatePDF, 
  formatBytes 
} from '../utils/pdfEngine';
import type { PageThumbnail } from '../types';

export const ReorderRotateTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageThumbnail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [modifiedBlob, setModifiedBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-organized.pdf');

  const handleFileAdded = async (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;

    setFile(pdf);
    setOutputName(pdf.name.replace(/\.pdf$/i, '_organized.pdf'));
    setIsLoading(true);
    setIsComplete(false);
    setModifiedBlob(null);

    try {
      const thumbs = await renderPageThumbnails(pdf);
      setPages(thumbs);
    } catch (err) {
      console.error('Error loading pages:', err);
      alert('Could not render PDF pages.');
    } finally {
      setIsLoading(false);
    }
  };

  const rotatePage = (index: number, degDelta: number) => {
    setPages((prev) => {
      const copy = [...prev];
      const currentRot = copy[index].rotation;
      copy[index] = {
        ...copy[index],
        rotation: (currentRot + degDelta + 360) % 360,
      };
      return copy;
    });
  };

  const rotateAll = (degDelta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + degDelta + 360) % 360,
      }))
    );
  };

  const toggleDelete = (index: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], isDeleted: !copy[index].isDeleted };
      return copy;
    });
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === pages.length - 1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    const copy = [...pages];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setPages(copy);
  };

  const handleSave = async () => {
    if (!file) return;
    const activeCount = pages.filter((p) => !p.isDeleted).length;
    if (activeCount === 0) {
      alert('You cannot delete all pages!');
      return;
    }

    setIsProcessing(true);
    try {
      const modifiedBytes = await reorderAndRotatePDF(file, pages);
      const blob = new Blob([modifiedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setModifiedBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981'],
      });
    } catch (err) {
      console.error('Error organizing PDF:', err);
      alert('Failed to process PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!modifiedBlob) return;
    saveAs(modifiedBlob, outputName || 'striid-organized.pdf');
  };

  const resetAll = () => {
    setFile(null);
    setPages([]);
    setIsComplete(false);
    setModifiedBlob(null);
  };

  const activePagesCount = pages.filter((p) => !p.isDeleted).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <RotateCw className="h-3.5 w-3.5" />
          <span>Rotate & Reorganize Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Rotate, Reorder & Delete Pages
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Fix sideways pages, delete unneeded pages, and arrange your document order visually in real-time.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a PDF to rearrange or rotate"
          subtitle="Drop a PDF file to edit individual pages"
          accept=".pdf,application/pdf"
        />
      ) : isComplete && modifiedBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl max-w-3xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">PDF Successfully Organized!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Exported {activePagesCount} pages ({formatBytes(modifiedBlob.size)}).
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
              Download Organized PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Edit Another File
            </button>
          </div>
        </div>
      ) : (
        /* Visual Editor Grid */
        <div className="space-y-6">
          {/* Top Bar with global tools */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">{file.name}</p>
              <p className="text-xs text-slate-400">
                {activePagesCount} active pages {pages.some((p) => p.isDeleted) ? '(' + pages.filter((p) => p.isDeleted).length + ' deleted)' : ''}
              </p>
            </div>

            {/* Quick bulk actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => rotateAll(90)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5 text-blue-400" />
                Rotate All 90°
              </button>
              <button
                onClick={() => rotateAll(180)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5 text-indigo-400" />
                Flip All 180°
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Loading PDF pages into editor...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((p, idx) => (
                <div
                  key={p.originalIndex + '-' + idx}
                  className={`group relative rounded-xl border-2 p-2.5 transition-all flex flex-col items-center bg-slate-900 ${
                    p.isDeleted
                      ? 'border-red-500/30 bg-red-950/20 opacity-40'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Action overlay / buttons */}
                  <div className="flex items-center justify-between w-full mb-2 px-1">
                    <span className="text-[11px] font-bold text-slate-400">
                      Page {idx + 1}
                    </span>
                    <button
                      onClick={() => toggleDelete(idx)}
                      title={p.isDeleted ? 'Restore Page' : 'Delete Page'}
                      className={`p-1 rounded transition-colors ${
                        p.isDeleted
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      {p.isDeleted ? <Undo2 className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Thumbnail with visual rotation */}
                  <div className="w-full aspect-[1/1.414] bg-white rounded overflow-hidden flex items-center justify-center shadow-md p-1">
                    <img
                      src={p.dataUrl}
                      alt={'Page ' + p.pageNumber}
                      style={{
                        transform: `rotate(${p.rotation}deg)`,
                        transition: 'transform 0.2s ease',
                      }}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* Controls below page */}
                  {!p.isDeleted && (
                    <div className="mt-2.5 flex items-center justify-between w-full px-0.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePage(idx, 'left')}
                          disabled={idx === 0}
                          title="Move Left"
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => movePage(idx, 'right')}
                          disabled={idx === pages.length - 1}
                          title="Move Right"
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                        >
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => rotatePage(idx, -90)}
                          title="Rotate Left"
                          className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => rotatePage(idx, 90)}
                          title="Rotate Right"
                          className="p-1 text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <RotateCw className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <button
              onClick={resetAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Choose different PDF
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing || activePagesCount === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4" />
                  <span>Save & Download ({activePagesCount} Pages)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
