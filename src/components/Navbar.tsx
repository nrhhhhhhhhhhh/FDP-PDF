import React from 'react';
import { 
  FileText, Download, Printer, ZoomIn, ZoomOut, 
  PenTool, Layers, Edit3, Grid, Shield, Plus, Stamp, Sparkles, Square, Circle, ArrowRight, Minus, Trash2
} from 'lucide-react';
import { ActiveTab, ToolMode, PDFDocumentData } from '../types';

interface NavbarProps {
  documentData: PDFDocumentData;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  toolMode: ToolMode;
  setToolMode: (mode: ToolMode) => void;
  zoom: number;
  setZoom: (zoom: number | ((z: number) => number)) => void;
  onOpenSignatureModal: () => void;
  onExportPdf: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearAllEdits: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  documentData,
  activeTab,
  setActiveTab,
  toolMode,
  setToolMode,
  zoom,
  setZoom,
  onOpenSignatureModal,
  onExportPdf,
  onFileUpload,
  onClearAllEdits,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="bg-white text-slate-800 flex flex-col border-b border-slate-200 shadow-xs select-none">
      {/* Top Application Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
            PDF
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              {documentData.title}
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Free & Secure
              </span>
            </h1>
            <p className="text-xs text-slate-500">Client-Side PDF Editor • {documentData.fileSize}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Open PDF
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={onFileUpload}
            className="hidden"
          />
          <button
            onClick={onExportPdf}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Save / Export
          </button>
          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={onClearAllEdits}
            className="px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Clear all edits and annotations you have made"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" /> Clear Edits
          </button>
        </div>
      </div>

      {/* Mode Tabs & Editing Toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50 overflow-x-auto gap-4 border-t border-slate-100">
        {/* Main Category Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {[
            { id: 'edit', label: 'Edit & Annotate', icon: Edit3 },
            { id: 'organize', label: 'Organize Pages', icon: Grid },
            { id: 'fill-sign', label: 'Fill & Sign', icon: PenTool },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sub-toolbar based on active tab */}
        {activeTab === 'edit' && (
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {[
              { id: 'select', label: 'Select', icon: Layers },
              { id: 'text', label: 'Edit Text', icon: Edit3 },
              { id: 'highlight', label: 'Highlight', icon: FileText },
              { id: 'shape-rect', label: 'Rectangle', icon: Square },
              { id: 'shape-circle', label: 'Oval / Circle', icon: Circle },
              { id: 'shape-line', label: 'Line', icon: Minus },
              { id: 'shape-arrow', label: 'Arrow', icon: ArrowRight },
              { id: 'pen', label: 'Draw', icon: PenTool },
              { id: 'stamp', label: 'Stamp', icon: Stamp },
              { id: 'redact', label: 'Redact PII', icon: Shield },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = toolMode === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setToolMode(tool.id as ToolMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {tool.label}
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'fill-sign' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSignatureModal}
              className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PenTool className="w-3.5 h-3.5" /> Create Signature
            </button>
            <button
              onClick={() => setToolMode('signature')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                toolMode === 'signature' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Place Signature Stamp
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs ml-auto">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 15))}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold text-slate-700 px-2">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(200, z + 15))}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
