import React, { useState, useEffect } from 'react';
import { QrCode, Download } from 'lucide-react';
import QRCode from 'qrcode';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';

export const QrGeneratorTool: React.FC = () => {
  const [content, setContent] = useState('https://striid.uk');
  const [qrUrl, setQrUrl] = useState('');
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  useEffect(() => {
    if (!content) {
      setQrUrl('');
      return;
    }

    QRCode.toDataURL(content, {
      width: 400,
      margin: 2,
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [content, darkColor, lightColor]);

  const handleDownload = () => {
    if (!qrUrl) return;
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    saveAs(qrUrl, 'striid_qrcode.png');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <QrCode className="h-3.5 w-3.5" />
          <span>QR & Sharing Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Custom QR Code Generator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Generate clean, high-resolution QR codes for websites, Wi-Fi networks, and contact cards instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="md:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Website URL or Text Content
            </label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="e.g. https://yourwebsite.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                QR Foreground Color
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-700">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="h-7 w-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{darkColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Background Color
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-700">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="h-7 w-7 rounded cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{lightColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col items-center justify-between text-center">
          <div className="w-48 h-48 bg-white rounded-2xl p-3 flex items-center justify-center shadow-lg">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-slate-400">Enter text to preview</span>
            )}
          </div>

          <button
            onClick={handleDownload}
            disabled={!qrUrl}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all hover:scale-105"
          >
            <Download className="h-4 w-4" />
            <span>Download High-Res PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
