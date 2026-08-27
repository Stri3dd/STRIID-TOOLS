import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Plus, 
  Loader2, 
  CheckCircle2, 
  RefreshCw, 
  FileText 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { convertImagesToPDF, formatBytes } from '../utils/pdfEngine';
import type { ImageToPdfItem } from '../types';

export const ImagesToPdfTool: React.FC = () => {
  const [items, setItems] = useState<ImageToPdfItem[]>([]);
  const [orientation, setOrientation] = useState<'fit' | 'portrait' | 'landscape'>('portrait');
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [outputName, setOutputName] = useState('striid-document.pdf');

  const handleImagesAdded = (files: File[]) => {
    const validImages = files.filter(
      (f) => f.type.startsWith('image/') || f.name.match(/\.(png|jpe?g|webp)$/i)
    );
    if (validImages.length === 0) return;

    const newItems: ImageToPdfItem[] = validImages.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems]);
    setIsComplete(false);
    setPdfBlob(null);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setItems(copy);
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) URL.revokeObjectURL(item.previewUrl);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleConvert = async () => {
    if (items.length === 0) return;
    setIsConverting(true);

    try {
      const files = items.map((i) => i.file);
      const pdfBytes = await convertImagesToPDF(files, orientation);
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfBlob(blob);
      setIsComplete(true);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#6366f1'],
      });
    } catch (err) {
      console.error('Error generating PDF from images:', err);
      alert('Error creating PDF from images.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    saveAs(pdfBlob, outputName || 'striid-document.pdf');
  };

  const resetAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
    setIsComplete(false);
    setPdfBlob(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Images to PDF Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Convert Images to a PDF
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Combine JPG, PNG, and WebP pictures into a clean multi-page PDF document. Arrange order & select layout.
        </p>
      </div>

      {items.length === 0 ? (
        <DropZone
          onFilesSelected={handleImagesAdded}
          multiple={true}
          title="Select or drop images to convert to PDF"
          subtitle="Supports JPG, PNG, and WebP pictures"
          accept="image/*"
          icon={<ImageIcon className="h-8 w-8" />}
        />
      ) : isComplete && pdfBlob ? (
        /* Success State */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 sm:p-12 text-center backdrop-blur-sm shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 mb-4 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">PDF Created Successfully!</h2>
          <p className="mt-1 text-sm text-slate-400">
            Combined {items.length} images into a clean PDF ({formatBytes(pdfBlob.size)}).
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
              Download Generated PDF
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Convert More Images
            </button>
          </div>
        </div>
      ) : (
        /* Image Reorder & Page Setup */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <p className="text-sm font-bold text-white">Selected Images ({items.length})</p>
              <p className="text-xs text-slate-400">
                Drag or use arrows to adjust page order
              </p>
            </div>

            {/* Layout selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Page Layout:</span>
              <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-0.5 text-xs">
                {(['portrait', 'landscape', 'fit'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setOrientation(mode)}
                    className={`rounded px-2.5 py-1 font-semibold capitalize transition-all ${
                      orientation === mode
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'fit' ? 'Auto Fit' : mode}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-center gap-1.5 cursor-pointer rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              <Plus className="h-3.5 w-3.5" />
              <span>Add Images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleImagesAdded(Array.from(e.target.files));
                }}
              />
            </label>
          </div>

          {/* Image Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 flex flex-col items-center group hover:border-slate-700 transition-all"
              >
                {/* Index badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Page {idx + 1}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-1 rounded bg-slate-900/80 text-slate-400 hover:text-red-400 transition-colors shadow"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* Preview */}
                <div className="w-full aspect-square bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center mb-2 mt-4">
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Name & controls */}
                <p className="text-[11px] font-medium text-slate-300 truncate w-full text-center">
                  {item.name}
                </p>

                <div className="flex items-center justify-center gap-2 mt-2 w-full pt-1 border-t border-slate-800">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    title="Move earlier"
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === items.length - 1}
                    title="Move later"
                    className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
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
              Clear all images
            </button>
            <button
              onClick={handleConvert}
              disabled={isConverting || items.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isConverting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Building PDF Document...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  <span>Create PDF from {items.length} Images</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
