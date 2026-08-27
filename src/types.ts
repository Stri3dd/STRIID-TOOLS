export type ToolCategory = 'all' | 'pdf' | 'image' | 'text' | 'security' | 'uk-lifestyle';

export type ToolId = 
  // Home
  | 'home'
  // PDF Suite
  | 'merge' 
  | 'split' 
  | 'reorder' 
  | 'pdf-to-img' 
  | 'img-to-pdf' 
  | 'protect' 
  | 'unlock'
  | 'ai-summary'
  // Image Suite
  | 'img-compress'
  | 'img-exif-strip'
  | 'img-palette'
  // Text Suite
  | 'ai-humanizer'
  | 'word-counter'
  | 'case-converter'
  // Security & Dev
  | 'password-gen'
  | 'qr-generator'
  // UK Lifestyle & Running
  | 'uk-salary'
  | 'running-pace';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  shortDesc: string;
  icon: string;
}

export interface ToolInfo {
  id: ToolId;
  category: ToolCategory;
  name: string;
  shortDesc: string;
  icon: string;
  badge?: string;
  isPro?: boolean;
}

export interface PageThumbnail {
  pageNumber: number;
  originalIndex: number;
  dataUrl: string;
  width: number;
  height: number;
  rotation: number;
  isDeleted: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  previewUrl?: string;
}

export interface ImageToPdfItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}
