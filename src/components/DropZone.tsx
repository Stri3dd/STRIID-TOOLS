import React, { useRef, useState } from 'react';
import { UploadCloud, Plus, ShieldCheck } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  accept = '.pdf,application/pdf',
  multiple = true,
  title,
  subtitle,
  icon,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
          : 'border-slate-700/80 bg-slate-900/40 hover:border-blue-500/50 hover:bg-slate-900/70'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-md">
        {icon || <UploadCloud className="h-8 w-8" />}
      </div>

      <h3 className="mt-4 text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{subtitle}</p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Choose Files
        </button>
        <span className="text-xs text-slate-500">or drop files here</span>
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/80">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>100% In-Browser. Files are never uploaded.</span>
      </div>
    </div>
  );
};
