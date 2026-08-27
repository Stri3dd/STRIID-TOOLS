import React, { useState, useEffect } from 'react';
import { 
  Minimize2, 
  Download, 
  ArrowRight, 
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from '../DropZone';
import { formatBytes } from '../../utils/pdfEngine';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [compressedUrl, setCompressedUrl] = useState<string>('');
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileAdded = (files: File[]) => {
    const img = files.find((f) => f.type.startsWith('image/'));
    if (!img) return;

    setFile(img);
    setPreviewUrl(URL.createObjectURL(img));
    setCompressedBlob(null);
  };

  const processCompression = (imgFile: File, q: number, maxW: number) => {
    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsCompressing(false);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Determine output type (keep PNG or use JPEG/WebP)
        const mimeType = imgFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const qFactor = mimeType === 'image/png' ? undefined : q / 100;

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              if (compressedUrl) URL.revokeObjectURL(compressedUrl);
              setCompressedUrl(URL.createObjectURL(blob));
            }
            setIsCompressing(false);
          },
          mimeType,
          qFactor
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imgFile);
  };

  useEffect(() => {
    if (file) {
      processCompression(file, quality, maxWidth);
    }
  }, [file, quality, maxWidth]);

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    saveAs(compressedBlob, 'compressed_' + file.name);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setPreviewUrl('');
    setCompressedUrl('');
    setCompressedBlob(null);
  };

  const percentSaved = file && compressedBlob 
    ? Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100))
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Minimize2 className="h-3.5 w-3.5" />
          <span>Image Compressor Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Compress Images in Browser
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Reduce JPG, PNG, and WebP file sizes instantly without quality loss. 100% processed on your device.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select an image to compress"
          subtitle="Supports JPG, PNG, and WebP pictures"
          accept="image/*"
          icon={<ImageIcon className="h-8 w-8" />}
        />
      ) : (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="line-through">{formatBytes(file.size)}</span>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                  <span className="font-bold text-emerald-400">
                    {compressedBlob ? formatBytes(compressedBlob.size) : 'Calculating...'}
                  </span>
                  {percentSaved > 0 && (
                    <span className="rounded bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 text-[10px]">
                      -{percentSaved}% Smaller
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAll}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Change image
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-105"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download ({compressedBlob ? formatBytes(compressedBlob.size) : '...'})
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Compression Quality:</span>
                  <span className="text-blue-400 font-bold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={95}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Max Width Resolution:</span>
                  <span className="text-blue-400 font-bold">{maxWidth}px</span>
                </div>
                <input
                  type="range"
                  min={800}
                  max={3840}
                  step={100}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Original ({formatBytes(file.size)})
              </span>
              <div className="w-full aspect-[4/3] bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-2">
                <img src={previewUrl} alt="Original" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-slate-900/50 p-3 text-center">
              <span className="text-[11px] font-semibold text-emerald-400 block mb-2">
                Compressed ({compressedBlob ? formatBytes(compressedBlob.size) : '...'})
              </span>
              <div className="w-full aspect-[4/3] bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center p-2">
                {compressedUrl && (
                  <img src={compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
