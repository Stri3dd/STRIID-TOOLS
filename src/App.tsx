import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryTabs } from './components/common/CategoryTabs';
import { ToolNavigation, ALL_TOOLS } from './components/ToolNavigation';
import { HomePage } from './components/home/HomePage';
import { HeroSuiteGrid } from './components/common/HeroSuiteGrid';
import { MergeTool } from './components/MergeTool';
import { SplitTool } from './components/SplitTool';
import { ReorderRotateTool } from './components/ReorderRotateTool';
import { PdfToImagesTool } from './components/PdfToImagesTool';
import { ImagesToPdfTool } from './components/ImagesToPdfTool';
import { ProtectTool } from './components/ProtectTool';
import { UnlockTool } from './components/UnlockTool';
import { AiSummaryTool } from './components/AiSummaryTool';
import { ImageCompressorTool } from './components/image/ImageCompressorTool';
import { ExifStripperTool } from './components/image/ExifStripperTool';
import { ColorPaletteTool } from './components/image/ColorPaletteTool';
import { AiHumanizerTool } from './components/text/AiHumanizerTool';
import { WordCounterTool } from './components/text/WordCounterTool';
import { CaseConverterTool } from './components/text/CaseConverterTool';
import { PasswordGeneratorTool } from './components/security/PasswordGeneratorTool';
import { QrGeneratorTool } from './components/security/QrGeneratorTool';
import { UkSalaryCalculatorTool } from './components/uk/UkSalaryCalculatorTool';
import { RunningPaceTool } from './components/uk/RunningPaceTool';
import { ProModal } from './components/ProModal';
import { LegalModal } from './components/common/LegalModal';
import { WhyStriidSection } from './components/WhyStriidSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import type { ToolId, ToolCategory } from './types';

export function App() {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [currentTool, setCurrentTool] = useState<ToolId>('home');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<'privacy' | 'terms'>('privacy');

  // Sync hash on initial load e.g. tools.striid.uk/#ai-humanizer
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as ToolId;
    if (hash === 'home' || !hash) {
      setCurrentTool('home');
      setActiveCategory('all');
      return;
    }
    const match = ALL_TOOLS.find((t) => t.id === hash);
    if (match) {
      setCurrentTool(match.id);
      setActiveCategory(match.category);
    }
  }, []);

  const handleSelectCategory = (cat: ToolCategory) => {
    setActiveCategory(cat);
    if (cat === 'all') {
      setCurrentTool('home');
      window.location.hash = '';
      return;
    }
    const firstToolInCat = ALL_TOOLS.find((t) => t.category === cat);
    if (firstToolInCat) {
      setCurrentTool(firstToolInCat.id);
      window.location.hash = firstToolInCat.id;
    }
  };

  const handleSelectTool = (id: ToolId) => {
    if (id === 'home') {
      setCurrentTool('home');
      setActiveCategory('all');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const match = ALL_TOOLS.find((t) => t.id === id);
    if (match) {
      setActiveCategory(match.category);
    }
    setCurrentTool(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: 'privacy' | 'terms') => {
    setLegalTab(tab);
    setIsLegalModalOpen(true);
  };

  const renderActiveTool = () => {
    switch (currentTool) {
      case 'home':
        return <HomePage onSelectTool={handleSelectTool} onOpenPro={() => setIsProModalOpen(true)} />;

      // PDF Suite
      case 'merge':
        return <MergeTool />;
      case 'split':
        return <SplitTool />;
      case 'reorder':
        return <ReorderRotateTool />;
      case 'pdf-to-img':
        return <PdfToImagesTool />;
      case 'img-to-pdf':
        return <ImagesToPdfTool />;
      case 'protect':
        return <ProtectTool />;
      case 'unlock':
        return <UnlockTool />;
      case 'ai-summary':
        return <AiSummaryTool onOpenPro={() => setIsProModalOpen(true)} />;

      // Image Suite
      case 'img-compress':
        return <ImageCompressorTool />;
      case 'img-exif-strip':
        return <ExifStripperTool />;
      case 'img-palette':
        return <ColorPaletteTool />;

      // Text Suite
      case 'ai-humanizer':
        return <AiHumanizerTool onOpenPro={() => setIsProModalOpen(true)} />;
      case 'word-counter':
        return <WordCounterTool />;
      case 'case-converter':
        return <CaseConverterTool />;

      // Security Suite
      case 'password-gen':
        return <PasswordGeneratorTool />;
      case 'qr-generator':
        return <QrGeneratorTool />;

      // UK & Lifestyle Suite
      case 'uk-salary':
        return <UkSalaryCalculatorTool />;
      case 'running-pace':
        return <RunningPaceTool />;

      default:
        return <HomePage onSelectTool={handleSelectTool} onOpenPro={() => setIsProModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        onOpenPro={() => setIsProModalOpen(true)}
      />

      {/* Category Tabs */}
      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Tool Navigation Tabs within Category (when a specific category is active) */}
      {currentTool !== 'home' && activeCategory !== 'all' && (
        <ToolNavigation
          currentTool={currentTool}
          activeCategory={activeCategory}
          onSelectTool={handleSelectTool}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {renderActiveTool()}

        {/* Master Suites Grid (shown when on a specific tool page to explore others) */}
        {currentTool !== 'home' && (
          <HeroSuiteGrid
            onSelectTool={handleSelectTool}
            onSelectCategory={handleSelectCategory}
          />
        )}

        {/* Comparison & Trust Section */}
        <WhyStriidSection />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectTool={handleSelectTool}
        onOpenPro={() => setIsProModalOpen(true)}
        onOpenLegal={handleOpenLegal}
      />

      {/* Non-Intrusive Pro Modal */}
      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      {/* Compliance & Legal Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        initialTab={legalTab}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}

export default App;
