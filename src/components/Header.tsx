import React from 'react';
import { ShieldCheck, SlidersHorizontal, Scale, Download, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenQuickWeight: () => void;
  onOpenBackup: () => void;
  currentWeight: number;
  targetWeight: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenProfile,
  onOpenQuickWeight,
  onOpenBackup,
  currentWeight,
  targetWeight,
}) => {
  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Brand & Privacy Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-xs">
                <Scale className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-stone-900 tracking-tight leading-none">
                  Nutrition & Weight
                </h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Lock className="w-2.5 h-2.5" />
                    Private Local Storage
                  </span>
                  <span className="text-[11px] text-stone-600 hidden sm:inline">
                    • No public profile
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile quick actions */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                id="btn-mobile-log-weight"
                onClick={onOpenQuickWeight}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                title="Log New Weight"
              >
                <Scale className="w-4 h-4" />
              </button>
              <button
                id="btn-mobile-profile"
                onClick={onOpenProfile}
                className="inline-flex items-center justify-center p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                title="Profile & Targets"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation & Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick summary badges */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-600">
              <span>Current: <strong className="text-stone-900">{currentWeight} kg</strong></span>
              <span className="text-stone-300">|</span>
              <span>Target: <strong className="text-stone-900">{targetWeight} kg</strong></span>
            </div>

            <button
              id="btn-log-weight"
              onClick={onOpenQuickWeight}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Scale className="w-3.5 h-3.5" />
              Log Weight
            </button>

            <button
              id="btn-profile-settings"
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Profile & Targets
            </button>

            <button
              id="btn-backup-data"
              onClick={onOpenBackup}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 text-xs font-medium p-2 rounded-lg transition-colors"
              title="Backup & Private Storage"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
