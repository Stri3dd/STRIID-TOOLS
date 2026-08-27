import React, { useState } from 'react';
import { ShieldCheck, X, Check } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [tab, setTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl text-left overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Legal & Compliance</h2>
              <p className="text-xs text-slate-400">tools.striid.uk • UK GDPR & Privacy First</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 pt-3 gap-2">
          <button
            onClick={() => setTab('privacy')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              tab === 'privacy'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Privacy Policy (UK GDPR)
          </button>
          <button
            onClick={() => setTab('terms')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              tab === 'terms'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {tab === 'privacy' ? (
            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">1. Zero Server Upload Architecture</h3>
                <p className="text-slate-400">
                  Striid Tools (<code className="text-blue-400">tools.striid.uk</code>) is architected with a strict <b>Zero-Knowledge, Client-Side Only</b> model. All PDF operations, image processing, text transformations, and cryptography calculations execute entirely in your web browser memory via WebAssembly and JavaScript. <b>No files or text inputs are ever sent to, stored on, or processed by our servers.</b>
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">2. Cookies & Tracking</h3>
                <p className="text-slate-400">
                  We do not use invasive third-party tracking cookies or advertising pixels. Anonymous edge metrics may be gathered by Cloudflare Web Analytics solely for network security and traffic uptime monitoring (without identifying individual users).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">3. UK Data Protection Act 2018 & UK GDPR Compliance</h3>
                <p className="text-slate-400">
                  Because Striid does not collect, store, or process personal data on remote infrastructure, your confidential documents (contracts, financial statements, medical records) remain under your exclusive control at all times on your local machine.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">4. Third-Party Links</h3>
                <p className="text-slate-400">
                  Our service does not sell, rent, or monetize your data. Any external services (such as future payment gateways for Striid Pro) are governed by their respective privacy terms.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">1. Agreement to Terms</h3>
                <p className="text-slate-400">
                  By accessing or using <code className="text-blue-400">tools.striid.uk</code>, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may discontinue use of the application.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">2. Permitted Use & Acceptable Behavior</h3>
                <p className="text-slate-400">
                  You agree to use Striid Tools solely for lawful purposes. You may not attempt to reverse engineer, disrupt network availability, or abuse the free tool access through distributed automated attack vectors.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">3. Disclaimer of Warranties</h3>
                <p className="text-slate-400">
                  Striid Tools is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While we strive for maximum accuracy and security in client-side operations, we make no guarantees regarding data integrity or specific financial/tax advice outcomes.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">4. Limitation of Liability</h3>
                <p className="text-slate-400">
                  To the maximum extent permitted by applicable UK law, Striid shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our tools.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">5. Governing Law</h3>
                <p className="text-slate-400">
                  These Terms shall be governed and construed in accordance with the laws of England and Wales.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Understood</span>
          </button>
        </div>
      </div>
    </div>
  );
};
