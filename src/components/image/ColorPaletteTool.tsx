import React, { useState } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCw 
} from 'lucide-react';
import { DropZone } from '../DropZone';

export const ColorPaletteTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [colors, setColors] = useState<{ hex: string; rgb: string }[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleFileAdded = (files: File[]) => {
    const img = files.find((f) => f.type.startsWith('image/'));
    if (!img) return;

    setFile(img);
    const url = URL.createObjectURL(img);
    setPreviewUrl(url);
    extractColors(url);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  };

  const extractColors = (imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 100;
      canvas.height = 100;
      ctx.drawImage(img, 0, 0, 100, 100);

      const imageData = ctx.getImageData(0, 0, 100, 100).data;
      const colorBuckets = new Map<string, number>();

      for (let i = 0; i < imageData.length; i += 16) {
        const r = Math.round(imageData[i] / 24) * 24;
        const g = Math.round(imageData[i + 1] / 24) * 24;
        const b = Math.round(imageData[i + 2] / 24) * 24;
        const key = `${r},${g},${b}`;
        colorBuckets.set(key, (colorBuckets.get(key) || 0) + 1);
      }

      const sorted = Array.from(colorBuckets.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      const extracted = sorted.map(([rgbStr]) => {
        const [r, g, b] = rgbStr.split(',').map(Number);
        return {
          hex: rgbToHex(r, g, b).toUpperCase(),
          rgb: `rgb(${r}, ${g}, ${b})`,
        };
      });

      setColors(extracted);
    };
    img.src = imgUrl;
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setColors([]);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400 mb-3">
          <Palette className="h-3.5 w-3.5" />
          <span>Color & Design Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Extract Color Palette from Image
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Upload any picture, UI design, or logo to instantly generate a matching color swatch with HEX & RGB codes.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select an image to extract colors"
          subtitle="Generate color schemes from photos or logos"
          accept="image/*"
          icon={<Palette className="h-8 w-8 text-purple-400" />}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div>
              <p className="text-sm font-bold text-white truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-slate-400">Extracted {colors.length} dominant shades</p>
            </div>
            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              New Image
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 flex items-center justify-center">
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img src={previewUrl} alt="Source" className="max-h-full max-w-full object-contain" />
              </div>
            </div>

            {/* Swatches */}
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => copyColor(c.hex)}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col items-center gap-2 group hover:border-slate-600 transition-all text-left"
                >
                  <div
                    className="w-full h-16 rounded-lg shadow-inner border border-white/10 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="w-full flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-white">{c.hex}</span>
                    {copiedHex === c.hex ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-slate-500 group-hover:text-slate-300" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
