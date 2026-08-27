import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Type, 
  ShieldCheck, 
  PoundSterling 
} from 'lucide-react';
import type { ToolCategory, CategoryInfo } from '../../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'pdf',
    name: 'PDF Suite',
    shortDesc: 'Merge, Split, Rotate & Protect',
    icon: 'FileText',
  },
  {
    id: 'image',
    name: 'Image & Media',
    shortDesc: 'Compress, Strip EXIF & Palette',
    icon: 'ImageIcon',
  },
  {
    id: 'text',
    name: 'Text & Content',
    shortDesc: 'Word Count & Case Formatting',
    icon: 'Type',
  },
  {
    id: 'security',
    name: 'Security & Crypto',
    shortDesc: 'Passwords & Custom QR Codes',
    icon: 'ShieldCheck',
  },
  {
    id: 'uk-lifestyle',
    name: 'UK Finance & Pace',
    shortDesc: 'Take-Home Pay & Running Pace',
    icon: 'PoundSterling',
  },
];

interface CategoryTabsProps {
  activeCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText className="h-4 w-4" />;
      case 'ImageIcon': return <ImageIcon className="h-4 w-4" />;
      case 'Type': return <Type className="h-4 w-4" />;
      case 'ShieldCheck': return <ShieldCheck className="h-4 w-4" />;
      case 'PoundSterling': return <PoundSterling className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full border-b border-slate-800 bg-slate-950/60 py-2 overflow-x-auto no-scrollbar">
      <div className="mx-auto flex max-w-7xl gap-2 px-4 sm:px-6 min-w-max justify-start md:justify-center">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800/60'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-slate-400'}>
                {getIcon(cat.icon)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
