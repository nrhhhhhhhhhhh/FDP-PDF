import React from 'react';
import { Lock, FileText, CheckCircle2, Search, X, BarChart2 } from 'lucide-react';
import { PDFDocumentData } from '../types';

interface RightPanelProps {
  documentData: PDFDocumentData;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectMatch: (pageIndex: number) => void;
  onOpenSecurityModal: () => void;
  showPageNumbers: boolean;
  setShowPageNumbers: (val: boolean) => void;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
  setPageNumberPosition: (pos: 'bottom-center' | 'bottom-right' | 'bottom-left') => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  documentData,
  searchQuery,
  setSearchQuery,
  onSelectMatch,
  onOpenSecurityModal,
  showPageNumbers,
  setShowPageNumbers,
  pageNumberPosition,
  setPageNumberPosition,
}) => {
  // Compute search matches across document
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: { pageIndex: number; pageNumber: number; snippet: string }[] = [];
    documentData.pages.forEach((page, idx) => {
      if (page.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        const textLower = page.text.toLowerCase();
        const queryLower = searchQuery.toLowerCase();
        const matchIdx = textLower.indexOf(queryLower);
        const start = Math.max(0, matchIdx - 30);
        const end = Math.min(page.text.length, matchIdx + queryLower.length + 30);
        const snippet = (start > 0 ? '...' : '') + page.text.substring(start, end) + (end < page.text.length ? '...' : '');
        results.push({
          pageIndex: idx,
          pageNumber: page.pageNumber,
          snippet,
        });
      }
    });
    return results;
  }, [documentData, searchQuery]);

  const totalWords = React.useMemo(() => {
    return documentData.pages.reduce((acc, p) => acc + p.text.split(/\s+/).filter(Boolean).length, 0);
  }, [documentData]);

  const totalChars = React.useMemo(() => {
    return documentData.pages.reduce((acc, p) => acc + p.text.length, 0);
  }, [documentData]);

  const readingTime = Math.max(1, Math.ceil(totalWords / 200));

  return (
    <aside className="w-80 bg-white text-slate-800 flex flex-col border-l border-slate-200 select-none shadow-2xs">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" /> Document Inspector
        </h3>
        <span className="text-[10px] bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
          Free PDF
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Document Text Search Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-800 font-semibold text-xs">
            <span className="flex items-center gap-1.5"><Search className="w-4 h-4 text-blue-600" /> Find in Document</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-0.5 font-semibold"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search text..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {searchQuery.trim() && (
            <div className="space-y-2 pt-1 max-h-48 overflow-y-auto">
              <span className="text-[11px] text-slate-500 block font-medium">
                {searchResults.length} match{searchResults.length === 1 ? '' : 'es'} found
              </span>
              {searchResults.length === 0 && (
                <p className="text-xs text-slate-500 py-2 text-center">No matches found.</p>
              )}
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  onClick={() => onSelectMatch(res.pageIndex)}
                  className="p-3 bg-white hover:bg-blue-50/60 border border-slate-200 rounded-xl cursor-pointer transition-colors text-xs space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">Page {res.pageNumber}</span>
                    <span className="text-[10px] text-slate-400 group-hover:text-blue-600">Jump →</span>
                  </div>
                  <p className="text-slate-600 text-[11px] font-mono leading-relaxed truncate">{res.snippet}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Document Statistics (New Feature 4) */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
            <BarChart2 className="w-4 h-4 text-blue-600" /> Live Statistics
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Words</p>
              <p className="text-xs font-bold text-slate-900">{totalWords}</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Chars</p>
              <p className="text-xs font-bold text-slate-900">{totalChars}</p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-500 font-semibold uppercase">Read Time</p>
              <p className="text-xs font-bold text-slate-900">{readingTime} min</p>
            </div>
          </div>
        </div>

        {/* Page Numbers Settings Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-800 font-semibold text-xs">
            <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-blue-600" /> Page Numbers</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showPageNumbers}
                onChange={(e) => setShowPageNumbers(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {showPageNumbers && (
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-medium text-slate-600 uppercase">Margin Position</label>
              <select
                value={pageNumberPosition}
                onChange={(e) => setPageNumberPosition(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </div>
          )}
        </div>

        {/* Document Info Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
            <FileText className="w-4 h-4 text-blue-600" /> Properties
          </div>
          <div className="text-xs space-y-1.5 text-slate-600">
            <p><strong className="text-slate-800">File Name:</strong> {documentData.fileName}</p>
            <p><strong className="text-slate-800">Author:</strong> {documentData.author || 'User'}</p>
            <p><strong className="text-slate-800">Subject:</strong> {documentData.subject || 'PDF Document'}</p>
            <p><strong className="text-slate-800">Total Pages:</strong> {documentData.pages.length}</p>
            <p><strong className="text-slate-800">Security:</strong> {documentData.isProtected ? 'Password Protected' : 'Standard'}</p>
          </div>
        </div>

        {/* Security & Password Encryption Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-slate-800 font-semibold text-xs">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-amber-600" /> Security & Password</span>
            {documentData.isProtected && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Protected
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {documentData.isProtected 
              ? `Secured with ${documentData.encryptionLevel || '256-bit AES'}.`
              : 'Add optional user password protection to secure your PDF file.'}
          </p>
          <button
            onClick={onOpenSecurityModal}
            className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600" /> {documentData.isProtected ? 'Change Password' : 'Set Password'}
          </button>
        </div>

        {/* Digital Signature Status */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free & Private
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            All editing and signing happens locally in your browser. No files or data are uploaded to any server.
          </p>
        </div>
      </div>
    </aside>
  );
};
