import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Striid process my files without uploading them?',
      a: 'Striid uses modern browser technologies including WebAssembly and JavaScript PDF engines (PDF.js and PDF-lib). When you drag a file into Striid, the calculations happen directly in your device’s memory. Your document never leaves your machine.',
    },
    {
      q: 'Is there a file size limit or daily quota?',
      a: 'Because your browser does all the processing rather than an expensive cloud server, there are no artificial daily limits on standard files. You can merge, split, and convert as many files as you need.',
    },
    {
      q: 'Can I use Striid offline?',
      a: 'Yes! Once the webpage is loaded in your browser, all core PDF manipulation tools work offline with zero internet connectivity required.',
    },
    {
      q: 'What is Striid Pro for?',
      a: 'Striid Pro is designed for heavy-duty power users who need advanced capabilities like batch processing 50+ files at once, in-browser AI summaries & insights, and ultra-high resolution 300 DPI print exports.',
    },
    {
      q: 'Will my PDF files have watermarks?',
      a: 'Never. Striid outputs clean, professional PDF files without stamping any watermarks or logos on your documents.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-800/80">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Everything You Need to Know
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-blue-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
