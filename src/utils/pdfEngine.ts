import { PDFDocument, degrees, PageSizes } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { PageThumbnail } from '../types';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Format bytes into human readable format (e.g. 2.4 MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Read page count of a PDF file
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

/**
 * Merge multiple PDF files in order
 */
export async function mergePDFs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

/**
 * Render visual thumbnails of all pages in a PDF
 */
export async function renderPageThumbnails(
  file: File,
  scale = 0.4
): Promise<PageThumbnail[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const thumbnails: PageThumbnail[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await (page.render as any)({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    thumbnails.push({
      pageNumber: pageNum,
      originalIndex: pageNum - 1,
      dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      width: viewport.width,
      height: viewport.height,
      rotation: 0,
      isDeleted: false,
    });
  }

  return thumbnails;
}

/**
 * Split PDF by extracting selected pages
 */
export async function extractPdfPages(
  file: File,
  pageIndices: number[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  const validIndices = pageIndices.filter(
    (idx) => idx >= 0 && idx < srcPdf.getPageCount()
  );

  const copiedPages = await newPdf.copyPages(srcPdf, validIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
}

/**
 * Parse page range string like "1-3, 5, 8-10" to 0-based page indices
 */
export function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const indices = new Set<number>();
  const parts = rangeStr.split(',').map((p) => p.trim());

  for (const part of parts) {
    if (!part) continue;
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((s) => parseInt(s.trim(), 10));
      if (!isNaN(startStr) && !isNaN(endStr)) {
        const start = Math.max(1, Math.min(startStr, endStr));
        const end = Math.min(totalPages, Math.max(startStr, endStr));
        for (let p = start; p <= end; p++) {
          indices.add(p - 1);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= totalPages) {
        indices.add(p - 1);
      }
    }
  }

  return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Reorder, rotate, and delete pages to produce a modified PDF
 */
export async function reorderAndRotatePDF(
  file: File,
  pages: { originalIndex: number; rotation: number; isDeleted: boolean }[]
): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  const activePages = pages.filter((p) => !p.isDeleted);
  const originalIndices = activePages.map((p) => p.originalIndex);

  const copiedPages = await newPdf.copyPages(srcPdf, originalIndices);

  copiedPages.forEach((copiedPage, i) => {
    const config = activePages[i];
    if (config.rotation !== 0) {
      const currentRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRotation + config.rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  });

  return await newPdf.save();
}

/**
 * Convert PDF pages to high-resolution PNG / JPEG images
 */
export async function convertPDFToImages(
  file: File,
  format: 'png' | 'jpeg' = 'png',
  scale = 2.0
): Promise<{ name: string; blob: Blob }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  const results: { name: string; blob: Blob }[] = [];
  const baseName = file.name.replace(/\.pdf$/i, '');

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) continue;

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await (page.render as any)({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
    const ext = format === 'jpeg' ? 'jpg' : 'png';

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), mimeType, 0.95);
    });

    if (blob) {
      results.push({
        name: `${baseName}_page_${pageNum}.${ext}`,
        blob,
      });
    }
  }

  return results;
}

/**
 * Convert multiple images (PNG/JPG) to a single PDF
 */
export async function convertImagesToPDF(
  images: File[],
  orientation: 'portrait' | 'landscape' | 'fit' = 'fit'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const imgFile of images) {
    const imgBytes = await imgFile.arrayBuffer();
    let embeddedImg;

    if (imgFile.type === 'image/jpeg' || imgFile.name.match(/\.(jpe?g)$/i)) {
      embeddedImg = await pdfDoc.embedJpg(imgBytes);
    } else {
      embeddedImg = await pdfDoc.embedPng(imgBytes);
    }

    const { width: imgW, height: imgH } = embeddedImg;

    if (orientation === 'fit') {
      const page = pdfDoc.addPage([imgW, imgH]);
      page.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: imgW,
        height: imgH,
      });
    } else {
      const isLandscape = orientation === 'landscape';
      const pageWidth = isLandscape ? PageSizes.A4[1] : PageSizes.A4[0];
      const pageHeight = isLandscape ? PageSizes.A4[0] : PageSizes.A4[1];
      const margin = 20;

      const availW = pageWidth - margin * 2;
      const availH = pageHeight - margin * 2;

      const scaleRatio = Math.min(availW / imgW, availH / imgH, 1);
      const drawW = imgW * scaleRatio;
      const drawH = imgH * scaleRatio;

      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      page.drawImage(embeddedImg, {
        x: (pageWidth - drawW) / 2,
        y: (pageHeight - drawH) / 2,
        width: drawW,
        height: drawH,
      });
    }
  }

  return await pdfDoc.save();
}

/**
 * Unlock and remove password restrictions from a PDF
 */
export async function unlockPDF(file: File, password?: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();

  // Try direct decryption with PDFDocument first
  try {
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    // Re-save without encryption
    return await pdfDoc.save();
  } catch {
    // Fall back to PDF.js password authentication and reconstruction
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      password: password || '',
    });
    const pdf = await loadingTask.promise;
    const cleanPdf = await PDFDocument.create();

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) continue;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await (page.render as any)({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise;

      const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const imgBytes = await (await fetch(imgDataUrl)).arrayBuffer();
      const embeddedImg = await cleanPdf.embedJpg(imgBytes);

      const [origW, origH] = [page.view[2] - page.view[0], page.view[3] - page.view[1]];
      const cleanPage = cleanPdf.addPage([origW, origH]);

      cleanPage.drawImage(embeddedImg, {
        x: 0,
        y: 0,
        width: origW,
        height: origH,
      });
    }

    return await cleanPdf.save();
  }
}
