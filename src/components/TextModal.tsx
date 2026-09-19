import React, { useState } from 'react';
import { X, Type } from 'lucide-react';

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveText: (text: string, font: string, size: number, color: string) => void;
}

export const TextModal: React.FC<TextModalProps> = ({ isOpen, onClose, onSaveText }) => {
  const [content, setContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Helvetica');
  const [fontSize, setFontSize] = useState(14);
  const [color, setColor] = useState('#1e3a8a');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveText(content, fontFamily, fontSize, color);
    setContent('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-sm">Edit / Format PDF Text & Font Matching</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Text Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your text here..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="Helvetica">Helvetica (Sans-Serif)</option>
                <option value="Times New Roman">Times New Roman (Serif)</option>
                <option value="Courier">Courier (Monospace)</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Font Size (pt)</label>
              <input
                type="number"
                min={8}
                max={72}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600">{color}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm"
            >
              Add to Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
