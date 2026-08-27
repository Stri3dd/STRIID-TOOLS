import React, { useState } from 'react';
import { 
  FileImage, 
  Download, 
  Loader2, 
  CheckCircle2, 
  RefreshCw, 
  Archive
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from './DropZone';
import { convertPDFToImages, formatBytes } from '../utils/pdfEngine';

export const PdfToImagesTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState<number>(2.0);
  const [isConverting, setIsConverting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [images, setImages] = useState<{ name: string; blob: Blob; url: string }[]>([]);

  const handleFileAdded = async (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;
    setFile(pdf);
    setIsComplete(false);
    setImages([]);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const rendered = await convertPDFToImages(file, format, scale);
      const withUrls = rendered.map((img) => ({
        ...img,
        url: URL.createObjectURL(img.blob),
      }));
      setImages(withUrls);
      setIsComplete(true);

      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch (err) {
      console.error('Error converting PDF to images:', err);
      alert('Error converting PDF to images.');
    } finally {
      setIsConverting(false);
    }
  };

  const downloadSingle = (blob: Blob, name: string) => {
    saveAs(blob, name);
  };

  const downloadAllZip = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    images.forEach((img) => {
      zip.file(img.name, img.blob);
    });

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const baseName = file?.name.replace(/\.pdf$/i, '') || 'striid-images';
    saveAs(zipBlob, baseName + '_images.zip');
  };

  const resetAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setFile(null);
    setImages([]);
    setIsComplete(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <FileImage className="h-3.5 w-3.5" />
          <span>PDF to Image Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Convert PDF to High-Res Images
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Extract every page as a crisp PNG or JPG picture. Download individually or as a single ZIP archive.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a PDF to convert to images"
          subtitle="Extract pages into PNG or JPG pictures"
          accept=".pdf,application/pdf"
        />
      ) : isComplete ? (
        /* Results view */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-emerald-500/30 bg-slate-900/80 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Successfully converted {images.length} pages!
                </p>
                <p className="text-xs text-slate-400">
                  Format: {format.toUpperCase()} • Scale: {scale}x
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadAllZip}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
              >
                <Archive className="h-4 w-4" />
                Download All (ZIP)
              </button>
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                New File
              </button>
            </div>
          </div>

          {/* Grid of rendered images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.name}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex flex-col items-center group hover:border-slate-700 transition-all"
              >
                <div className="w-full aspect-[1/1.414] bg-white rounded overflow-hidden flex items-center justify-center shadow-md mb-2">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="w-full flex items-center justify-between text-xs mt-1">
                  <span className="font-semibold text-slate-300 truncate max-w-[150px]">
                    Page {idx + 1} ({formatBytes(img.blob.size)})
                  </span>
                  <button
                    onClick={() => downloadSingle(img.blob, img.name)}
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Options & Convert trigger */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 space-y-6 max-w-2xl mx-auto">
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
            {/* Format choice */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Output Format
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    format === 'png'
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-bold">PNG (Lossless)</p>
                  <p className="text-[11px] text-slate-500">Best for text, logos, diagrams</p>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('jpeg')}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    format === 'jpeg'
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <p className="text-sm font-bold">JPG / JPEG</p>
                  <p className="text-[11px] text-slate-500">Smaller file size for photos</p>
                </button>
              </div>
            </div>

            {/* Quality scale */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Resolution & Quality
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Standard (1x)', val: 1.0, desc: 'Fast, small size' },
                  { label: 'High Res (2x)', val: 2.0, desc: 'Sharp text (Recommended)' },
                  { label: 'Ultra 300 DPI (3x)', val: 3.0, desc: 'Print quality' },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setScale(opt.val)}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      scale === opt.val
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-bold">{opt.label}</p>
                    <p className="text-[10px] text-slate-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Rendering Pages to Images...</span>
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4" />
                <span>Convert to Images</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
