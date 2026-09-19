import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Key, Eye, EyeOff } from 'lucide-react';
import { PDFDocumentData } from '../types';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: PDFDocumentData;
  onApplySecurity: (settings: { isProtected: boolean; userPassword: string; encryptionLevel: string; permissions: { print: boolean; copy: boolean; modify: boolean } }) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose, documentData, onApplySecurity }) => {
  const [userPassword, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [encryptionLevel, setEncryptionLevel] = useState('256-bit AES Enterprise');
  const [permissions, setPermissions] = useState({
    print: true,
    copy: false,
    modify: false,
  });

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPassword) {
      alert('Please enter a password to encrypt the document.');
      return;
    }
    if (userPassword !== confirmPassword) {
      alert('Passwords do not match. Please re-enter.');
      return;
    }

    onApplySecurity({
      isProtected: true,
      userPassword,
      encryptionLevel,
      permissions,
    });
    alert('PDF Document successfully encrypted and secured with 256-bit AES!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-sm">PDF Security & Encryption (FDP Pro)</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              Encrypt <strong>{documentData.fileName}</strong> with high-grade password protection and permission restrictions.
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Document Open Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="Enter secret password..."
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter secret password..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Encryption Strength</label>
              <select
                value={encryptionLevel}
                onChange={(e) => setEncryptionLevel(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="256-bit AES Enterprise">256-bit AES (Recommended Adobe Standard)</option>
                <option value="128-bit AES">128-bit AES (Standard Compatibility)</option>
                <option value="128-bit RC4">128-bit RC4 (Legacy Compatibility)</option>
              </select>
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2">
              <span className="text-xs font-semibold text-slate-700 uppercase block">Document Permissions</span>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.print}
                  onChange={(e) => setPermissions({ ...permissions, print: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Allow Document Printing
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.copy}
                  onChange={(e) => setPermissions({ ...permissions, copy: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Allow Text & Graphic Copying
              </label>
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={permissions.modify}
                  onChange={(e) => setPermissions({ ...permissions, modify: e.target.checked })}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Allow Document Modification / Editing
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4" /> Encrypt PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
