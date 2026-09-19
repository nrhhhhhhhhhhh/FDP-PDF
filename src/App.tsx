import React, { useState } from 'react';
import { PDFDocumentData, ActiveTab, ToolMode, Annotation } from './types';
import { SAMPLE_DOCUMENTS } from './data/sampleDocs';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PdfViewer } from './components/PdfViewer';
import { RightPanel } from './components/RightPanel';
import { SignatureModal } from './components/SignatureModal';
import { SecurityModal } from './components/SecurityModal';
import { TextModal } from './components/TextModal';
import { ExportModal } from './components/ExportModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { PDFDocument, rgb } from 'pdf-lib';

export default function App() {
  const [documentData, setDocumentData] = useState<PDFDocumentData>(SAMPLE_DOCUMENTS[0]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('edit');
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [showPageNumbers, setShowPageNumbers] = useState(true);
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom-center' | 'bottom-right' | 'bottom-left'>('bottom-center');

  // Modals state
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isTextModalOpen, setIsTextModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [pendingTextCoords, setPendingTextCoords] = useState<{ x: number; y: number } | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | undefined>(undefined);

  const handleSaveTextModal = (content: string, fontFamily: string, fontSize: number, color: string) => {
    if (pendingTextCoords) {
      handleAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'text',
        x: pendingTextCoords.x,
        y: pendingTextCoords.y,
        content,
        color,
        fontSize,
        fontFamily,
      });
      setPendingTextCoords(null);
    }
  };

  const handleApplySecurity = (settings: {
    isProtected: boolean;
    userPassword: string;
    encryptionLevel: string;
    permissions: { print: boolean; copy: boolean; modify: boolean };
  }) => {
    setDocumentData((prev) => ({
      ...prev,
      isProtected: true,
      encryptionLevel: settings.encryptionLevel,
    }));
  };

  // Page Organization Handlers
  const handleRotatePage = (index: number) => {
    setDocumentData((prev) => {
      const newPages = [...prev.pages];
      newPages[index] = {
        ...newPages[index],
        rotation: (newPages[index].rotation + 90) % 360,
      };
      return { ...prev, pages: newPages };
    });
  };

  const handleDeletePage = (index: number) => {
    if (documentData.pages.length <= 1) {
      alert('Cannot delete the last remaining page of the PDF.');
      return;
    }
    setDocumentData((prev) => {
      const newPages = prev.pages.filter((_, i) => i !== index);
      return { ...prev, pages: newPages };
    });
    if (currentPageIndex >= documentData.pages.length - 1) {
      setCurrentPageIndex(Math.max(0, documentData.pages.length - 2));
    }
  };

  const handleAddPage = () => {
    setDocumentData((prev) => {
      const newPageNumber = prev.pages.length + 1;
      const newPages = [
        ...prev.pages,
        {
          pageNumber: newPageNumber,
          width: 612,
          height: 792,
          rotation: 0,
          text: `[New Blank Page ${newPageNumber}]\n\nAdd your content or annotations here using the FDP editing tools.`,
        },
      ];
      return { ...prev, pages: newPages };
    });
    setCurrentPageIndex(documentData.pages.length);
  };

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= documentData.pages.length) return;
    setDocumentData((prev) => {
      const newPages = [...prev.pages];
      const temp = newPages[index];
      newPages[index] = newPages[targetIndex];
      newPages[targetIndex] = temp;
      // Re-index page numbers
      newPages.forEach((p, idx) => { p.pageNumber = idx + 1; });
      return { ...prev, pages: newPages };
    });
    setCurrentPageIndex(targetIndex);
  };

  const handleReorderPages = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    setDocumentData((prev) => {
      const newPages = [...prev.pages];
      const [movedPage] = newPages.splice(fromIndex, 1);
      newPages.splice(toIndex, 0, movedPage);
      newPages.forEach((p, idx) => { p.pageNumber = idx + 1; });
      return { ...prev, pages: newPages };
    });
    setCurrentPageIndex(toIndex);
  };

  const handleDuplicatePage = (index: number) => {
    setDocumentData((prev) => {
      const targetPage = prev.pages[index];
      const newPages = [...prev.pages];
      newPages.splice(index + 1, 0, {
        ...targetPage,
        pageNumber: index + 2,
        text: targetPage.text + ' (Duplicated)',
      });
      newPages.forEach((p, idx) => { p.pageNumber = idx + 1; });
      return { ...prev, pages: newPages };
    });
    setCurrentPageIndex(index + 1);
  };

  // Annotation Handlers
  const handleAddAnnotation = (annotation: Annotation) => {
    setDocumentData((prev) => ({
      ...prev,
      annotations: [...prev.annotations, annotation],
    }));
  };

  const handleUpdateAnnotation = (id: string, newContent: string) => {
    setDocumentData((prev) => ({
      ...prev,
      annotations: prev.annotations.map((ann) =>
        ann.id === id ? { ...ann, content: newContent } : ann
      ),
    }));
  };

  const handleDeleteAnnotation = (id: string) => {
    setDocumentData((prev) => ({
      ...prev,
      annotations: prev.annotations.filter((ann) => ann.id !== id),
    }));
  };

  const handleClearAllEdits = () => {
    setIsClearConfirmOpen(true);
  };

  const handleUpdatePageText = (pageIndex: number, newText: string) => {
    setDocumentData((prev) => {
      const newPages = [...prev.pages];
      if (newPages[pageIndex]) {
        newPages[pageIndex] = { ...newPages[pageIndex], text: newText };
      }
      return { ...prev, pages: newPages };
    });
  };

  // Export PDF / Conversion modal trigger
  const handleExportPdf = () => {
    setIsExportModalOpen(true);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const targetInput = e.target;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          if (!buffer) throw new Error('Failed to read file buffer.');

          const pdfDoc = await PDFDocument.load(buffer);
          const pageCount = pdfDoc.getPageCount();
          const pages = [];

          for (let i = 0; i < pageCount; i++) {
            const page = pdfDoc.getPage(i);
            const { width, height } = page.getSize();
            pages.push({
              pageNumber: i + 1,
              width: width || 612,
              height: height || 792,
              rotation: page.getRotation().angle || 0,
              text: `[Imported Document: ${file.name} - Page ${i + 1}]`,
            });
          }

          setDocumentData({
            title: file.name.replace(/\.[^/.]+$/, ''),
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            author: 'User Import',
            subject: 'Imported PDF',
            isProtected: false,
            pages,
            annotations: [],
          });
          setCurrentPageIndex(0);
          setUploadMessage(`Successfully uploaded "${file.name}" (${pageCount} pages). Quick Guide: Use the top toolbar to switch between Edit & Annotate, Organize Pages, Fill & Sign, and AI Pro Suite.`);
          targetInput.value = '';
        } catch (err: any) {
          console.error('PDF parsing error:', err);
          const textReader = new FileReader();
          textReader.onload = (textEvt) => {
            const textContent = textEvt.target?.result as string || '';
            setDocumentData({
              title: file.name.replace(/\.[^/.]+$/, ''),
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              author: 'User Upload',
              subject: 'Custom Document',
              isProtected: false,
              pages: [
                {
                  pageNumber: 1,
                  width: 612,
                  height: 792,
                  rotation: 0,
                  text: textContent,
                },
              ],
              annotations: [],
            });
            setCurrentPageIndex(0);
            setUploadMessage(`Successfully uploaded "${file.name}". Quick Guide: Use the top toolbar to edit or use AI tools.`);
            targetInput.value = '';
          };
          textReader.readAsText(file);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans relative">
      {/* Upload Success Toast & Quick Guide */}
      {uploadMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-blue-900/95 border border-blue-700 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-4 max-w-xl backdrop-blur-md animate-fade-in">
          <div className="text-xs leading-relaxed">
            {uploadMessage}
          </div>
          <button
            onClick={() => setUploadMessage(null)}
            className="text-blue-300 hover:text-white text-xs font-bold px-2 py-1 bg-blue-800/80 rounded-lg shrink-0"
          >
            Got It
          </button>
        </div>
      )}

      <Navbar
        documentData={documentData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toolMode={toolMode}
        setToolMode={setToolMode}
        zoom={zoom}
        setZoom={setZoom}
        onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
        onExportPdf={handleExportPdf}
        onFileUpload={handleFileUpload}
        onClearAllEdits={handleClearAllEdits}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          documentData={documentData}
          currentPageIndex={currentPageIndex}
          setCurrentPageIndex={setCurrentPageIndex}
          onRotatePage={handleRotatePage}
          onDeletePage={handleDeletePage}
          onAddPage={handleAddPage}
          onMovePage={handleMovePage}
          onDuplicatePage={handleDuplicatePage}
          onReorderPages={handleReorderPages}
        />

        <PdfViewer
          documentData={documentData}
          currentPageIndex={currentPageIndex}
          zoom={zoom}
          toolMode={toolMode}
          onAddAnnotation={handleAddAnnotation}
          onUpdateAnnotation={handleUpdateAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
          signatureDataUrl={signatureDataUrl}
          searchQuery={searchQuery}
          onTriggerTextModal={(x, y) => {
            setPendingTextCoords({ x, y });
            setIsTextModalOpen(true);
          }}
          onUpdatePageText={handleUpdatePageText}
          showPageNumbers={showPageNumbers}
          pageNumberPosition={pageNumberPosition}
        />

        <RightPanel
          documentData={documentData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelectMatch={(pageIndex) => setCurrentPageIndex(pageIndex)}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          showPageNumbers={showPageNumbers}
          setShowPageNumbers={setShowPageNumbers}
          pageNumberPosition={pageNumberPosition}
          setPageNumberPosition={setPageNumberPosition}
        />
      </div>

      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSaveSignature={(url) => {
          setSignatureDataUrl(url);
          setToolMode('signature');
        }}
      />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        documentData={documentData}
        onApplySecurity={handleApplySecurity}
      />

      <TextModal
        isOpen={isTextModalOpen}
        onClose={() => setIsTextModalOpen(false)}
        onSaveText={handleSaveTextModal}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentData={documentData}
      />

      <ClearConfirmModal
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={() => {
          setDocumentData((prev) => ({
            ...prev,
            annotations: [],
          }));
        }}
      />
    </div>
  );
}
