import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  MapPin, 
  Camera, 
  Calendar, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveAs } from 'file-saver';
import { DropZone } from '../DropZone';
import { formatBytes } from '../../utils/pdfEngine';

export const ExifStripperTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cleanBlob, setCleanBlob] = useState<Blob | null>(null);
  const [isStripping, setIsStripping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleFileAdded = (files: File[]) => {
    const img = files.find((f) => f.type.startsWith('image/'));
    if (!img) return;

    setFile(img);
    setPreviewUrl(URL.createObjectURL(img));
    setIsComplete(false);
    setCleanBlob(null);
  };

  const handleStripMetadata = () => {
    if (!file) return;
    setIsStripping(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);

        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCleanBlob(blob);
              setIsComplete(true);
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            }
            setIsStripping(false);
          },
          mimeType,
          0.98
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!cleanBlob || !file) return;
    saveAs(cleanBlob, 'clean_' + file.name);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setCleanBlob(null);
    setIsComplete(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Privacy & Security Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Remove EXIF & GPS Metadata
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Strip hidden location data, camera serial numbers, and device timestamps before sharing photos online.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a photo to strip metadata"
          subtitle="Removes GPS coordinates, camera model, and dates"
          accept="image/*"
          icon={<ShieldCheck className="h-8 w-8 text-emerald-400" />}
        />
      ) : isComplete && cleanBlob ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-8 text-center backdrop-blur-sm shadow-xl space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Metadata 100% Stripped!</h2>
            <p className="text-xs text-slate-400 mt-1">
              All GPS location tags, camera EXIF, and device identifiers have been permanently removed.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-105"
            >
              <Download className="h-4 w-4" />
              Download Clean Photo ({formatBytes(cleanBlob.size)})
            </button>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Clean Another Photo
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <p className="text-sm font-bold text-white truncate max-w-sm">{file.name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
            </div>
            <button onClick={resetAll} className="text-xs text-slate-400 hover:text-white">
              Change file
            </button>
          </div>

          {/* Metadata items to be stripped */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-red-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-300">GPS Location</p>
                <p className="text-[10px] text-slate-500">Coordinates & altitude</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
              <Camera className="h-5 w-5 text-blue-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-300">Camera Specs</p>
                <p className="text-[10px] text-slate-500">Lens, shutter, phone ID</p>
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-300">Timestamp</p>
                <p className="text-[10px] text-slate-500">Date & exact time</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStripMetadata}
            disabled={isStripping}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Strip All Metadata & Secure Image</span>
          </button>
        </div>
      )}
    </div>
  );
};
