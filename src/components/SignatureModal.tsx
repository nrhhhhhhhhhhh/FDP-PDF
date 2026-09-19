import React, { useState, useRef } from 'react';
import { X, Check, PenTool, Type, Upload } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSaveSignature }) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [typedFont, setTypedFont] = useState('font-serif');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSave = () => {
    if (activeTab === 'draw') {
      const canvas = canvasRef.current;
      if (canvas) {
        onSaveSignature(canvas.toDataURL());
      }
    } else if (activeTab === 'type') {
      // Render typed signature to canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'italic 36px serif';
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText(typedName || 'Signature', 30, 90);
        onSaveSignature(canvas.toDataURL());
      }
    } else if (activeTab === 'upload' && uploadedImage) {
      onSaveSignature(uploadedImage);
    }
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-800">Create Digital Signature (FDP Pro)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2 gap-4">
          <button
            onClick={() => setActiveTab('draw')}
            className={`pb-3 px-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'draw' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" /> Draw
          </button>
          <button
            onClick={() => setActiveTab('type')}
            className={`pb-3 px-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'type' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <Type className="w-4 h-4" /> Type
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 px-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" /> Image Upload
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'draw' && (
            <div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={180}
                  className="cursor-crosshair bg-white w-full h-[180px]"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="text-xs px-2.5 py-1 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">Use your mouse or touch screen to draw your legal signature.</p>
            </div>
          )}

          {activeTab === 'type' && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Alexander Sterling"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg font-serif focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className={`text-4xl text-blue-900 italic ${typedFont}`}>
                  {typedName || 'Your Signature'}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="py-4 space-y-4">
              <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-700">Click to upload signature image (PNG/JPG)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              {uploadedImage && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center">
                  <img src={uploadedImage} alt="Uploaded signature" className="max-h-24 object-contain" />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" /> Insert Signature
          </button>
        </div>
      </div>
    </div>
  );
};
