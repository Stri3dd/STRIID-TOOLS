import React, { useState } from 'react';
import { 
  Scissors, 
  Download, 
  Loader2, 
  CheckCircle2, 
  RefreshCw, 
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { 
  renderPageThumbnails, 
  extractPdfPages, 
  parsePageRanges, 
  formatBytes 
} from '../utils/pdfEngine';
import type { PageThumbnail } from '../types';

export const SplitTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<PageThumbnail[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [rangeInput, setRangeInput] = useState('');
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-split.pdf');

  const handleFileAdded = async (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;

    setFile(pdf);
    setOutputName(pdf.name.replace(/\.pdf$/i, '_extracted.pdf'));
    setIsLoadingThumbnails(true);
    setIsComplete(false);
    setExtractedBlob(null);

    try {
      const thumbs = await renderPageThumbnails(pdf);
      setThumbnails(thumbs);
      const allIndices = thumbs.map((_, i) => i);
      setSelectedIndices(allIndices);
      setRangeInput('1-' + thumbs.length);
    } catch (err) {
      console.error('Error rendering thumbnails:', err);
      alert('Could not preview PDF pages.');
    } finally {
      setIsLoadingThumbnails(false);
    }
  };

  const togglePageSelection = (index: number) => {
    let newSelected: number[];
    if (selectedIndices.includes(index)) {
      newSelected = selectedIndices.filter((i) => i !== index);
    } else {
      newSelected = [...selectedIndices, index].sort((a, b) => a - b);
    }
    setSelectedIndices(newSelected);
    syncRangeString(newSelected);
  };

  const syncRangeString = (indices: number[]) => {
    if (indices.length === 0) {
      setRangeInput('');
      return;
    }
    const pageNums = indices.map((i) => i + 1);
    setRangeInput(pageNums.join(', '));
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRangeInput(val);
    if (thumbnails.length > 0) {
      const parsed = parsePageRanges(val, thumbnails.length);
      setSelectedIndices(parsed);
    }
  };

  const selectOdd = () => {
    const odd = thumbnails.map((_, i) => i).filter((i) => (i + 1) % 2 !== 0);
    setSelectedIndices(odd);
    syncRangeString(odd);
  };

  const selectEven = () => {
    const even = thumbnails.map((_, i) => i).filter((i) => (i + 1) % 2 === 0);
    setSelectedIndices(even);
    syncRangeString(even);
  };

  const selectAll = () => {
    const all = thumbnails.map((_, i) => i);
    setSelectedIndices(all);
    syncRangeString(all);
  };

  const deselectAll = () => {
    setSelectedIndices([]);
    setRangeInput('');
  };

  const handleExtract = async () => {
    if (!file || selectedIndices.length === 0) return;
    setIsExtracting(true);

    try {
      const extractedBytes = await extractPdfPages(file, selectedIndices);
      const blob = new Blob([extractedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setExtractedBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#6366f1'],
      });
    } catch (err) {
      console.error('Extract error:', err);
      alert('Error extracting pages from PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDownload = () => {
    if (!extractedBlob) return;
    saveAs(extractedBlob, outputName || 'striid-split.pdf');
  };

  const resetAll = () => {
    setFile(null);
    setThumbnails([]);
    setSelectedIndices([]);
    setRangeInput('');
    setIsComplete(false);
    setExtractedBlob(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Scissors className="h-3.5 w-3.5" />
          <span>Split & Extract Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Extract Pages from PDF
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Visually select pages or type custom ranges (e.g. 1-3, 5, 8) to create a new PDF document.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a PDF to extract pages"
          subtitle="Drop a PDF file to preview all pages visually"
          accept=".pdf,application/pdf"
        />
      ) : isComplete && extractedBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Pages Extracted!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Successfully extracted {selectedIndices.length} pages ({formatBytes(extractedBlob.size)}).
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
              Download Extracted PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Split Another File
            </button>
          </div>
        </div>
      ) : (
        /* Visual Page Selection State */
        <div className="space-y-6">
          {/* File info bar & range input */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">{file.name}</p>
              <p className="text-xs text-slate-400">
                {thumbnails.length} total pages • {selectedIndices.length} selected for extraction
              </p>
            </div>

            {/* Range box */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-300 font-semibold shrink-0">
                Page Range:
              </label>
              <input
                type="text"
                value={rangeInput}
                onChange={handleRangeInputChange}
                placeholder="e.g. 1-3, 5, 7-9"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none w-44"
              />
            </div>

            {/* Selection presets */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={selectAll}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
              >
                All
              </button>
              <button
                onClick={deselectAll}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
              >
                None
              </button>
              <button
                onClick={selectOdd}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
              >
                Odd
              </button>
              <button
                onClick={selectEven}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white"
              >
                Even
              </button>
            </div>
          </div>

          {/* Thumbnail Grid */}
          {isLoadingThumbnails ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Generating visual page thumbnails...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {thumbnails.map((thumb, idx) => {
                const isSelected = selectedIndices.includes(idx);
                return (
                  <div
                    key={thumb.pageNumber}
                    onClick={() => togglePageSelection(idx)}
                    className={`group relative cursor-pointer rounded-xl border-2 p-2 transition-all duration-150 flex flex-col items-center bg-slate-900 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-950/20'
                        : 'border-slate-800 opacity-50 hover:opacity-80'
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <div
                      className={`absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 border border-slate-600 text-transparent'
                      }`}
                    >
                      ✓
                    </div>

                    {/* Page image preview */}
                    <div className="w-full aspect-[1/1.414] bg-white rounded overflow-hidden flex items-center justify-center shadow-md">
                      <img
                        src={thumb.dataUrl}
                        alt={'Page ' + thumb.pageNumber}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </div>

                    {/* Page number */}
                    <p className="mt-2 text-xs font-bold text-slate-300">
                      Page {thumb.pageNumber}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action bar */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <button
              onClick={resetAll}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              Choose different PDF
            </button>
            <button
              onClick={handleExtract}
              disabled={isExtracting || selectedIndices.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Extracting Pages...</span>
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4" />
                  <span>Extract {selectedIndices.length} Selected Pages</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
