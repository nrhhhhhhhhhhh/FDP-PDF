import React, { useState, useRef } from 'react';
import { PDFDocumentData, Annotation, ToolMode } from '../types';
import { Trash2, Move } from 'lucide-react';

interface PdfViewerProps {
  documentData: PDFDocumentData;
  currentPageIndex: number;
  zoom: number;
  toolMode: ToolMode;
  onAddAnnotation: (annotation: Annotation) => void;
  onUpdateAnnotation?: (id: string, newContent: string) => void;
  onDeleteAnnotation: (id: string) => void;
  signatureDataUrl?: string;
  searchQuery?: string;
  onTriggerTextModal: (x: number, y: number) => void;
  onUpdatePageText: (pageIndex: number, newText: string) => void;
  showPageNumbers: boolean;
  pageNumberPosition: 'bottom-center' | 'bottom-right' | 'bottom-left';
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  documentData,
  currentPageIndex,
  zoom,
  toolMode,
  onAddAnnotation,
  onUpdateAnnotation,
  onDeleteAnnotation,
  signatureDataUrl,
  searchQuery = '',
  onTriggerTextModal,
  onUpdatePageText,
  showPageNumbers,
  pageNumberPosition,
}) => {
  const page = documentData.pages[currentPageIndex] || documentData.pages[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedAnnId, setSelectedAnnId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editTextValue, setEditTextValue] = useState('');

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (toolMode === 'select' || toolMode === 'text') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (toolMode === 'highlight') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'highlight',
        x,
        y,
        width: 180,
        height: 20,
        color: '#fef08a',
      });
    } else if (toolMode === 'shape-rect') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'shape',
        shapeType: 'rect',
        x,
        y,
        width: 140,
        height: 90,
        color: '#2563eb',
      });
    } else if (toolMode === 'shape-circle') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'shape',
        shapeType: 'circle',
        x,
        y,
        width: 100,
        height: 100,
        color: '#2563eb',
      });
    } else if (toolMode === 'shape-line') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'shape',
        shapeType: 'line',
        x,
        y,
        width: 150,
        height: 4,
        color: '#2563eb',
      });
    } else if (toolMode === 'shape-arrow') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'shape',
        shapeType: 'arrow',
        x,
        y,
        width: 150,
        height: 24,
        color: '#2563eb',
      });
    } else if (toolMode === 'signature') {
      if (!signatureDataUrl) {
        alert('Please create or insert a signature first using the Fill & Sign menu.');
        return;
      }
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'signature',
        x,
        y,
        width: 140,
        height: 60,
        signatureDataUrl,
      });
    } else if (toolMode === 'redact') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'redact',
        x,
        y,
        width: 150,
        height: 22,
        isRedacted: true,
      });
    } else if (toolMode === 'stamp') {
      onAddAnnotation({
        id: 'ann-' + Date.now(),
        pageIndex: currentPageIndex,
        type: 'stamp',
        x,
        y,
        width: 140,
        height: 50,
        content: 'APPROVED',
        color: '#16a34a',
      });
    }
  };

  const pageAnnotations = documentData.annotations.filter((ann) => ann.pageIndex === currentPageIndex);

  return (
    <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-8 relative">
      {/* PDF Page Container */}
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        style={{
          width: `${page.width * (zoom / 100)}px`,
          height: `${page.height * (zoom / 100)}px`,
          transform: `rotate(${page.rotation}deg)`,
        }}
        className="bg-white rounded-xl shadow-2xl relative overflow-hidden cursor-crosshair border border-slate-300 transition-all duration-200 select-text"
      >
        {/* Render PDF text and layout */}
        <div
          contentEditable={toolMode === 'text'}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (toolMode === 'text') {
              onUpdatePageText(currentPageIndex, e.currentTarget.textContent || '');
            }
          }}
          className={`absolute inset-0 p-12 font-serif text-slate-800 text-sm leading-relaxed whitespace-pre-wrap select-text outline-none ${
            toolMode === 'text' ? 'cursor-text ring-2 ring-blue-500/50 bg-blue-50/10' : ''
          }`}
        >
          {searchQuery.trim() ? (
            page.text.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) =>
              part.toLowerCase() === searchQuery.toLowerCase() ? (
                <mark key={i} className="bg-amber-300 text-slate-900 font-semibold rounded px-0.5 shadow-xs">
                  {part}
                </mark>
              ) : (
                part
              )
            )
          ) : (
            page.text
          )}
        </div>

        {/* Render Annotations & Overlays */}
        {pageAnnotations.map((ann) => {
          const isSelected = selectedAnnId === ann.id;
          return (
            <div
              key={ann.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedAnnId(ann.id);
              }}
              style={{
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                width: ann.width ? `${ann.width}px` : 'auto',
                height: ann.height ? `${ann.height}px` : 'auto',
              }}
              className={`absolute group cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : ''
              }`}
            >
              {ann.type === 'text' && (
                editingTextId === ann.id ? (
                  <textarea
                    autoFocus
                    value={editTextValue}
                    onChange={(e) => setEditTextValue(e.target.value)}
                    onBlur={() => {
                      if (onUpdateAnnotation) {
                        onUpdateAnnotation(ann.id, editTextValue);
                      }
                      setEditingTextId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (onUpdateAnnotation) {
                          onUpdateAnnotation(ann.id, editTextValue);
                        }
                        setEditingTextId(null);
                      }
                    }}
                    style={{ color: ann.color || '#1e3a8a', fontSize: `${ann.fontSize || 14}px` }}
                    className="bg-white px-2 py-1 rounded shadow-md border-2 border-blue-600 outline-none resize-none"
                  />
                ) : (
                  <div
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingTextId(ann.id);
                      setEditTextValue(ann.content || '');
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAnnId(ann.id);
                      if (toolMode === 'text') {
                        setEditingTextId(ann.id);
                        setEditTextValue(ann.content || '');
                      }
                    }}
                    style={{ color: ann.color || '#1e3a8a', fontSize: `${ann.fontSize || 14}px` }}
                    className={`${
                      ann.fontFamily === 'Times New Roman' || ann.fontFamily === 'Georgia'
                        ? 'font-serif'
                        : ann.fontFamily === 'Courier'
                        ? 'font-mono'
                        : 'font-sans'
                    } font-semibold bg-white/90 hover:bg-blue-50/80 px-2 py-1 rounded shadow-xs border border-dashed border-slate-300 hover:border-blue-500 whitespace-pre-wrap transition-colors`}
                    title="Click in Edit Text mode or double-click to edit inline"
                  >
                    {ann.content}
                  </div>
                )
              )}

              {ann.type === 'highlight' && (
                <div
                  style={{ backgroundColor: ann.color || '#fef08a' }}
                  className="w-full h-full opacity-50 mix-blend-multiply rounded"
                />
              )}

              {ann.type === 'shape' && ann.shapeType === 'rect' && (
                <div
                  style={{ borderColor: ann.color || '#2563eb' }}
                  className="w-full h-full border-[1.5px] bg-blue-500/5 rounded shadow-2xs"
                />
              )}

              {ann.type === 'shape' && ann.shapeType === 'circle' && (
                <div
                  style={{ borderColor: ann.color || '#2563eb' }}
                  className="w-full h-full border-[1.5px] bg-blue-500/5 rounded-full shadow-2xs"
                />
              )}

              {ann.type === 'shape' && ann.shapeType === 'line' && (
                <div
                  style={{ backgroundColor: ann.color || '#2563eb' }}
                  className="w-full h-1.5 rounded-full shadow-2xs my-auto"
                />
              )}

              {ann.type === 'shape' && ann.shapeType === 'arrow' && (
                <div className="w-full h-full flex items-center relative">
                  <div
                    style={{ backgroundColor: ann.color || '#2563eb' }}
                    className="w-[calc(100%-10px)] h-1 rounded-l-full"
                  />
                  <div
                    style={{ borderLeftColor: ann.color || '#2563eb' }}
                    className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] absolute right-0"
                  />
                </div>
              )}

              {ann.type === 'signature' && ann.signatureDataUrl && (
                <div className="bg-white/95 p-1 rounded border border-slate-200 shadow-sm">
                  <img src={ann.signatureDataUrl} alt="Signature" className="max-h-14 object-contain" />
                </div>
              )}

              {ann.type === 'redact' && (
                <div className="w-full h-full bg-black text-black select-none font-mono text-xs flex items-center justify-center">
                  ██████████
                </div>
              )}

              {ann.type === 'stamp' && (
                <div className="w-full h-full border-4 border-emerald-600 bg-emerald-50/90 rounded-xl flex items-center justify-center font-black text-emerald-700 tracking-wider text-xs uppercase shadow-sm rotate-[-4deg]">
                  {ann.content || 'APPROVED'}
                </div>
              )}

              {/* Delete button on hover/selected */}
              {(isSelected || true) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAnnotation(ann.id);
                  }}
                  className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="Delete Annotation"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Page Number Footer */}
        {showPageNumbers && (
          <div className={`absolute bottom-4 z-20 text-xs font-mono text-slate-500 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs pointer-events-none select-none ${
            pageNumberPosition === 'bottom-center' ? 'left-1/2 -translate-x-1/2' :
            pageNumberPosition === 'bottom-right' ? 'right-6' : 'left-6'
          }`}>
            Page {currentPageIndex + 1} of {documentData.pages.length}
          </div>
        )}
      </div>
    </div>
  );
};
