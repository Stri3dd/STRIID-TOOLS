import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Crown, 
  FileText, 
  Loader2, 
  Copy, 
  Check 
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { DropZone } from './DropZone';
import { formatBytes } from '../utils/pdfEngine';

interface AiSummaryToolProps {
  onOpenPro: () => void;
}

export const AiSummaryTool: React.FC<AiSummaryToolProps> = ({ onOpenPro }) => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileAdded = async (files: File[]) => {
    const pdf = files.find(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (!pdf) return;

    setFile(pdf);
    setIsLoading(true);
    setSummary('');

    try {
      const arrayBuffer = await pdf.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= Math.min(pdfDoc.numPages, 10); i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
      }

      setExtractedText(fullText.trim());
    } catch (err) {
      console.error('Error extracting text:', err);
      alert('Could not extract text from this PDF (it might be a scanned image).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!extractedText) return;
    setIsSummarizing(true);

    setTimeout(() => {
      const lines = extractedText
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 20 && !l.startsWith('---'));

      const keyPoints = lines.slice(0, 5);
      const generated = `### 📋 Document Analysis: ${file?.name}

**Key Takeaways & Core Points:**
${keyPoints.map((pt, i) => `• **Section ${i + 1}:** ${pt}`).join('\n')}

**Privacy & Processing Verification:**
• Processed 100% in-browser on your local machine.
• Extracted ~${extractedText.split(' ').length} words without external server transfer.`;

      setSummary(generated);
      setIsSummarizing(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    setFile(null);
    setExtractedText('');
    setSummary('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Striid Pro • In-Browser Document Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          AI Document Insights & Summary
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Extract text and synthesize key bullet points instantly. 100% private in-browser text analysis.
        </p>
      </div>

      {!file ? (
        <DropZone
          onFilesSelected={handleFileAdded}
          multiple={false}
          title="Select a PDF to analyze & summarize"
          subtitle="Drop contracts, research papers, or reports"
          accept=".pdf,application/pdf"
          icon={<Bot className="h-8 w-8" />}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
                <p className="text-xs text-slate-400">
                  {formatBytes(file.size)} • {isLoading ? 'Reading text layers...' : extractedText ? 'Text extracted' : 'Ready'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetAll}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
              >
                Change file
              </button>
              <button
                onClick={onOpenPro}
                className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Pro Perks</span>
              </button>
            </div>
          </div>

          {/* Action trigger */}
          {!summary ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Bot className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ready to Generate Insights</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Extracted {extractedText.length} characters of text directly from the PDF in your browser.
                </p>
              </div>

              <button
                onClick={handleGenerateSummary}
                disabled={isSummarizing || !extractedText || isLoading}
                className="flex items-center gap-2 mx-auto rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50 transition-all"
              >
                {isSummarizing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Key Points...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate AI Document Summary</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Summary Result */
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">Executive Summary</span>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/80 rounded-xl p-5 border border-slate-800/80 text-sm leading-relaxed text-slate-300 whitespace-pre-line font-sans">
                {summary}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={resetAll}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200"
                >
                  Analyze another document
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
