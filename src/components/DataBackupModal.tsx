import React, { useRef, useState } from 'react';
import { X, ShieldCheck, Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';
import { exportBackupData, importBackupData } from '../utils/storage';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
  onResetDefaults: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
  onResetDefaults,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      const json = exportBackupData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutrition-weight-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMsg({ type: 'success', text: 'Backup downloaded successfully to your device.' });
    } catch (e) {
      setStatusMsg({ type: 'error', text: 'Failed to generate backup file.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupData(content);
      if (res.success) {
        setStatusMsg({ type: 'success', text: res.message });
        onDataRestored();
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Privacy & Local Storage</h2>
              <p className="text-[11px] text-stone-500">Private single-user management & backups</p>
            </div>
          </div>
          <button
            id="btn-close-backup-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Privacy Guarantee */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <p className="font-semibold text-emerald-900">Strict Single-User Privacy</p>
              <p className="text-emerald-800 leading-relaxed">
                Your weights, goals, and nutrition logs reside exclusively in your device’s local browser storage. There are no public user directories, no social sharing features, and no unnecessary registration accounts.
              </p>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Backup & Restore Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Data Portability & Backup
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export Button */}
              <button
                type="button"
                onClick={handleExport}
                className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-colors flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2 font-semibold text-xs text-stone-900">
                    <Download className="w-4 h-4 text-emerald-600" />
                    Download Backup (JSON)
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Save a private copy of your weight logs and meal records to your files.
                  </p>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium mt-3 group-hover:underline">
                  Save file →
                </span>
              </button>

              {/* Import Button */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-left transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-xs text-stone-900">
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Restore From Backup
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Load a saved backup file to restore your history on this or another browser.
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium mt-3 group-hover:underline">
                    Select JSON →
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Reset Baseline */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-500">Need to reset everything to sample baseline?</span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all tracker data to sample baseline (45 kg starting, 55 kg target)?')) {
                  onResetDefaults();
                  setStatusMsg({ type: 'success', text: 'Reset to sample baseline.' });
                }
              }}
              className="inline-flex items-center gap-1 text-stone-500 hover:text-rose-600 font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Baseline
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
