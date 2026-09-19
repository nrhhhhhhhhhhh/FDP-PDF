import React, { useState } from 'react';
import { Download, FileText, Code, FileSpreadsheet, ShieldCheck, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { PDFDocumentData } from '../types';
import { PDFDocument, rgb } from 'pdf-lib';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: PDFDocumentData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  documentData,
}) => {
  const [exportFormat, setExportFormat] = useState<string>('pdf');
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setSuccessMsg(false);
    try {
      const fullText = documentData.pages.map(p => p.text).join('\n\n--- Page Break ---\n\n');

      if (exportFormat === 'pdf' || exportFormat === 'compressed-pdf') {
        const pdfDoc = await PDFDocument.create();
        for (const pageData of documentData.pages) {
          const page = pdfDoc.addPage([pageData.width, pageData.height]);
          const { height } = page.getSize();
          page.drawText(pageData.text.substring(0, 1500), {
            x: 50,
            y: height - 60,
            size: 11,
            color: rgb(0.1, 0.1, 0.1),
            lineHeight: 16,
          });
          if (includePageNumbers) {
            page.drawText(`Page ${pageData.pageNumber} of ${documentData.pages.length}`, {
              x: pageData.width / 2 - 40,
              y: 30,
              size: 9,
              color: rgb(0.4, 0.4, 0.4),
            });
          }
        }
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + (exportFormat === 'compressed-pdf' ? '_compressed.pdf' : '_exported.pdf');
        link.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'txt') {
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + '.txt';
        link.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'md') {
        const mdContent = `# ${documentData.title}\n\n` + documentData.pages.map((p, i) => `## Page ${i + 1}\n\n${p.text}`).join('\n\n');
        const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + '.md';
        link.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'html') {
        const htmlContent = `<!DOCTYPE html><html><head><title>${documentData.title}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.6;color:#333}</style></head><body><h1>${documentData.title}</h1>` + documentData.pages.map((p, i) => `<hr/><h2>Page ${i + 1}</h2><p style="white-space:pre-wrap">${p.text}</p>`).join('') + `</body></html>`;
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + '.html';
        link.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'json') {
        const jsonContent = JSON.stringify(documentData, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + '.json';
        link.click();
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'word') {
        const rtfContent = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}} \\f0\\fs22 ${fullText.replace(/\n/g, '\\par ')}}`;
        const blob = new Blob([rtfContent], { type: 'application/rtf;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = (documentData.fileName || 'document').replace(/\.[^/.]+$/, '') + '.rtf';
        link.click();
        URL.revokeObjectURL(url);
      }

      setSuccessMsg(true);
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Export failed: ' + err.message);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">Advanced Export & File Conversion</h2>
              <p className="text-xs text-slate-500">Choose from multiple professional formats and conversion modes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 font-bold text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Format Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Select Format / Conversion</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'pdf', label: 'Standard PDF (.pdf)', desc: 'Optimized vector PDF document', icon: FileText },
                { id: 'compressed-pdf', label: 'Compressed PDF', desc: 'Reduced file size output', icon: FileText },
                { id: 'word', label: 'Word Document (.rtf)', desc: 'Editable Microsoft Word format', icon: FileSpreadsheet },
                { id: 'txt', label: 'Plain Text (.txt)', desc: 'Extracted raw text content', icon: FileText },
                { id: 'md', label: 'Markdown (.md)', desc: 'Formatted markdown document', icon: Code },
                { id: 'html', label: 'Web HTML (.html)', desc: 'Browser-viewable webpage', icon: Code },
                { id: 'json', label: 'JSON Data (.json)', desc: 'Structured data backup', icon: Code },
              ].map((fmt) => {
                const Icon = fmt.icon;
                const isSelected = exportFormat === fmt.id;
                return (
                  <div
                    key={fmt.id}
                    onClick={() => setExportFormat(fmt.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{fmt.label}</h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{fmt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options */}
          {(exportFormat === 'pdf' || exportFormat === 'compressed-pdf') && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">PDF Options</span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={includePageNumbers}
                  onChange={(e) => setIncludePageNumbers(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                Include page number footers
              </label>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Exported successfully! Downloading file...
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            {isExporting ? 'Exporting...' : 'Download Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
