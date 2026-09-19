import React, { useState } from 'react';
import { 
  FileText, Layers, Search, RotateCw, Trash2, Plus, ArrowUp, ArrowDown, Copy, GripVertical
} from 'lucide-react';
import { PDFDocumentData } from '../types';

interface SidebarProps {
  documentData: PDFDocumentData;
  currentPageIndex: number;
  setCurrentPageIndex: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onAddPage: () => void;
  onMovePage: (index: number, direction: 'up' | 'down') => void;
  onDuplicatePage: (index: number) => void;
  onReorderPages: (fromIndex: number, toIndex: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documentData,
  currentPageIndex,
  setCurrentPageIndex,
  onRotatePage,
  onDeletePage,
  onAddPage,
  onMovePage,
  onDuplicatePage,
  onReorderPages,
}) => {
  const [sidebarTab, setSidebarTab] = useState<'thumbnails' | 'outline' | 'search'>('thumbnails');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  return (
    <aside className="w-72 bg-white text-slate-800 flex flex-col border-r border-slate-200 select-none shadow-2xs">
      {/* Sidebar Mode Header */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-1">
        {[
          { id: 'thumbnails', label: 'Pages', icon: Layers },
          { id: 'outline', label: 'Outline', icon: FileText },
          { id: 'search', label: 'Search', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = sidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSidebarTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive ? 'bg-white text-blue-600 shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sidebar Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sidebarTab === 'thumbnails' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pages ({documentData.pages.length})
              </span>
              <button
                onClick={onAddPage}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs flex items-center gap-1 font-semibold px-3 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Page
              </button>
            </div>
            <p className="text-[11px] text-slate-400 italic mb-2">💡 Drag and drop page cards to reorder instantly.</p>

            {documentData.pages.map((page, idx) => {
              const isSelected = currentPageIndex === idx;
              return (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIdx(idx);
                    e.dataTransfer.setData('text/plain', idx.toString());
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const fromIdxStr = e.dataTransfer.getData('text/plain');
                    const fromIdx = parseInt(fromIdxStr, 10);
                    if (!isNaN(fromIdx) && fromIdx !== idx) {
                      onReorderPages(fromIdx, idx);
                    }
                    setDraggedIdx(null);
                  }}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`group relative rounded-2xl p-3 border cursor-grab active:cursor-grabbing transition-all ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-500 shadow-sm ring-1 ring-blue-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  } ${draggedIdx === idx ? 'opacity-40 border-dashed border-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <GripVertical className="w-3.5 h-3.5 text-slate-400" /> Page {page.pageNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); onRotatePage(idx); }}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDuplicatePage(idx); }}
                        className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {idx > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMovePage(idx, 'up'); }}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < documentData.pages.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMovePage(idx, 'down'); }}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {documentData.pages.length > 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeletePage(idx); }}
                          className="p-1 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Miniature Page Preview Box */}
                  <div className="bg-slate-50 rounded-xl h-32 p-3 text-[9px] text-slate-600 overflow-hidden font-serif border border-slate-200 shadow-inner">
                    <p className="font-bold text-slate-900 mb-1 truncate">{documentData.title}</p>
                    <p className="line-clamp-6 text-slate-600 leading-relaxed">{page.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {sidebarTab === 'outline' && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Outline
            </span>
            {documentData.pages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 font-semibold transition-colors shadow-2xs"
              >
                Page {page.pageNumber}: {page.text.split('\n')[0] || 'Untitled Section'}
              </button>
            ))}
          </div>
        )}

        {sidebarTab === 'search' && (
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Quick Search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery.trim() && (
              <div className="space-y-2 pt-1">
                {documentData.pages
                  .map((p, idx) => ({ p, idx }))
                  .filter(({ p }) => p.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(({ p, idx }) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentPageIndex(idx)}
                      className="p-3 bg-slate-50 hover:bg-blue-50/60 border border-slate-200 rounded-xl cursor-pointer transition-colors text-xs space-y-1"
                    >
                      <p className="font-bold text-blue-600">Page {p.pageNumber}</p>
                      <p className="text-slate-600 text-[11px] truncate">{p.text}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
