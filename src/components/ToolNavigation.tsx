import React from 'react';
import { 
  Layers, 
  Scissors, 
  RotateCw, 
  FileImage, 
  Image as ImageIcon, 
  Lock, 
  Unlock,
  Sparkles,
  Minimize2,
  ShieldCheck,
  Palette,
  FileText,
  Type,
  KeyRound,
  QrCode,
  PoundSterling,
  Zap,
  Bot
} from 'lucide-react';
import type { ToolId, ToolInfo, ToolCategory } from '../types';

export const ALL_TOOLS: ToolInfo[] = [
  // PDF Suite
  {
    id: 'merge',
    category: 'pdf',
    name: 'Merge PDF',
    shortDesc: 'Combine multiple PDFs in any order',
    icon: 'Layers',
  },
  {
    id: 'split',
    category: 'pdf',
    name: 'Split & Extract',
    shortDesc: 'Extract specific pages or page ranges',
    icon: 'Scissors',
  },
  {
    id: 'reorder',
    category: 'pdf',
    name: 'Rotate & Reorder',
    shortDesc: 'Visual grid to rearrange, rotate & delete pages',
    icon: 'RotateCw',
  },
  {
    id: 'pdf-to-img',
    category: 'pdf',
    name: 'PDF to Image',
    shortDesc: 'Extract pages as crisp PNG or JPG',
    icon: 'FileImage',
  },
  {
    id: 'img-to-pdf',
    category: 'pdf',
    name: 'Images to PDF',
    shortDesc: 'Convert JPG/PNG pictures to a PDF',
    icon: 'ImageIcon',
  },
  {
    id: 'protect',
    category: 'pdf',
    name: 'Protect PDF',
    shortDesc: 'Add password encryption to your document',
    icon: 'Lock',
  },
  {
    id: 'unlock',
    category: 'pdf',
    name: 'Unlock PDF',
    shortDesc: 'Remove password restrictions from PDF',
    icon: 'Unlock',
  },
  {
    id: 'ai-summary',
    category: 'pdf',
    name: 'AI Document Chat',
    shortDesc: 'In-browser smart summary & key points',
    icon: 'Sparkles',
    badge: 'PRO',
    isPro: true,
  },

  // Image Suite
  {
    id: 'img-compress',
    category: 'image',
    name: 'Compress Image',
    shortDesc: 'Reduce JPG/PNG/WebP size in browser',
    icon: 'Minimize2',
  },
  {
    id: 'img-exif-strip',
    category: 'image',
    name: 'Remove EXIF / GPS',
    shortDesc: 'Strip hidden location & camera metadata',
    icon: 'ShieldCheck',
  },
  {
    id: 'img-palette',
    category: 'image',
    name: 'Color Extractor',
    shortDesc: 'Get HEX & RGB palettes from images',
    icon: 'Palette',
  },

  // Text Suite
  {
    id: 'ai-humanizer',
    category: 'text',
    name: 'AI Text Humanizer',
    shortDesc: 'Rewrite AI text to sound 100% human',
    icon: 'Sparkles',
    badge: 'PRO',
    isPro: true,
  },
  {
    id: 'word-counter',
    category: 'text',
    name: 'Word Counter',
    shortDesc: 'Words, chars, and reading time stats',
    icon: 'FileText',
  },
  {
    id: 'case-converter',
    category: 'text',
    name: 'Case Converter',
    shortDesc: 'camelCase, Title Case, UPPERCASE',
    icon: 'Type',
  },

  // Security Suite
  {
    id: 'password-gen',
    category: 'security',
    name: 'Password Generator',
    shortDesc: 'Hardware-grade random passwords',
    icon: 'KeyRound',
  },
  {
    id: 'qr-generator',
    category: 'security',
    name: 'Custom QR Generator',
    shortDesc: 'High-res QR codes with colors',
    icon: 'QrCode',
  },

  // UK & Lifestyle Suite
  {
    id: 'uk-salary',
    category: 'uk-lifestyle',
    name: 'UK Take-Home Pay',
    shortDesc: '2026/27 Tax, NI & Student Loan Calc',
    icon: 'PoundSterling',
  },
  {
    id: 'running-pace',
    category: 'uk-lifestyle',
    name: 'Race Pace & Stride',
    shortDesc: 'Pace converter & 5k-Marathon times',
    icon: 'Zap',
  },
];

interface ToolNavigationProps {
  currentTool: ToolId;
  activeCategory: ToolCategory;
  onSelectTool: (id: ToolId) => void;
}

export const ToolNavigation: React.FC<ToolNavigationProps> = ({
  currentTool,
  activeCategory,
  onSelectTool,
}) => {
  const visibleTools = ALL_TOOLS.filter((t) => t.category === activeCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers': return <Layers className="h-4 w-4" />;
      case 'Scissors': return <Scissors className="h-4 w-4" />;
      case 'RotateCw': return <RotateCw className="h-4 w-4" />;
      case 'FileImage': return <FileImage className="h-4 w-4" />;
      case 'ImageIcon': return <ImageIcon className="h-4 w-4" />;
      case 'Lock': return <Lock className="h-4 w-4" />;
      case 'Unlock': return <Unlock className="h-4 w-4" />;
      case 'Sparkles': return <Sparkles className="h-4 w-4" />;
      case 'Minimize2': return <Minimize2 className="h-4 w-4" />;
      case 'ShieldCheck': return <ShieldCheck className="h-4 w-4" />;
      case 'Palette': return <Palette className="h-4 w-4" />;
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'Type': return <Type className="h-4 w-4" />;
      case 'KeyRound': return <KeyRound className="h-4 w-4" />;
      case 'QrCode': return <QrCode className="h-4 w-4" />;
      case 'PoundSterling': return <PoundSterling className="h-4 w-4" />;
      case 'Zap': return <Zap className="h-4 w-4" />;
      case 'Bot': return <Bot className="h-4 w-4" />;
      default: return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full border-b border-slate-800/80 bg-slate-900/40 py-2.5 overflow-x-auto no-scrollbar">
      <div className="mx-auto flex max-w-7xl gap-2 px-4 sm:px-6 min-w-max justify-start md:justify-center">
        {visibleTools.map((tool) => {
          const isActive = currentTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/40'
              }`}
            >
              <span className={isActive ? 'text-white' : tool.isPro ? 'text-amber-400' : 'text-blue-400'}>
                {getIcon(tool.icon)}
              </span>
              <span>{tool.name}</span>
              {tool.badge && (
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  isActive 
                    ? 'bg-white text-blue-600' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {tool.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
