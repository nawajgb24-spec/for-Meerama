import React, { useState } from 'react';
import { X, Scale, Calendar, Clock, FileText, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { getTodayDateString, getCurrentTimeString } from '../utils/storage';

interface QuickWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeight: number;
  targetWeight: number;
  onLogWeight: (weight: number, date: string, time: string, note?: string) => void;
}

export const QuickWeightModal: React.FC<QuickWeightModalProps> = ({
  isOpen,
  onClose,
  currentWeight,
  targetWeight,
  onLogWeight,
}) => {
  const [weight, setWeight] = useState<number>(currentWeight);
  const [date, setDate] = useState<string>(getTodayDateString());
  const [time, setTime] = useState<string>(getCurrentTimeString());
  const [note, setNote] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight > 0) {
      onLogWeight(Number(weight), date, time, note.trim() || undefined);
      onClose();
    }
  };

  const diff = Number((weight - currentWeight).toFixed(1));

  // Quick preset chips from prompt's explicit progression examples
  const exampleWeights = [45, 47, 50, 55];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Update Current Weight</h2>
              <p className="text-[11px] text-stone-500">Log a new weight entry anytime</p>
            </div>
          </div>
          <button
            id="btn-close-weight-modal"
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Main Weight Input */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center">
            <label htmlFor="input-log-weight" className="block text-xs font-medium text-stone-600 mb-2">
              Enter New Weight (kg)
            </label>
            <div className="inline-flex items-center justify-center relative max-w-[200px] mx-auto">
              <input
                id="input-log-weight"
                type="number"
                step="0.1"
                min="20"
                max="300"
                required
                autoFocus
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full text-center text-4xl font-extrabold text-stone-900 bg-white border border-stone-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
              />
              <span className="ml-2 text-base font-semibold text-stone-500">kg</span>
            </div>

            {/* Difference preview */}
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs">
              {diff === 0 ? (
                <span className="text-stone-500">Same as current weight ({currentWeight} kg)</span>
              ) : diff > 0 ? (
                <span className="inline-flex items-center gap-0.5 text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{diff} kg from previous ({currentWeight} kg)
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  {diff} kg from previous ({currentWeight} kg)
                </span>
              )}
            </div>

            {/* Quick Prompt Progression Chips */}
            <div className="mt-3.5 pt-3 border-t border-stone-200">
              <span className="block text-[11px] text-stone-500 mb-1.5">
                Quick select prompt examples:
              </span>
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {exampleWeights.map((ew) => (
                  <button
                    key={ew}
                    type="button"
                    onClick={() => setWeight(ew)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition-colors ${
                      weight === ew
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {ew} kg
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Number((prev + 0.5).toFixed(1)))}
                  className="px-2 py-1 text-xs rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  +0.5
                </button>
                <button
                  type="button"
                  onClick={() => setWeight((prev) => Number(Math.max(20, prev - 0.5).toFixed(1)))}
                  className="px-2 py-1 text-xs rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  -0.5
                </button>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-weight-date" className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Date
              </label>
              <input
                id="input-weight-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-weight-time" className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Time
              </label>
              <input
                id="input-weight-time"
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full text-xs font-medium text-stone-800 bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="input-weight-note" className="block text-xs font-medium text-stone-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              Note (Optional)
            </label>
            <input
              id="input-weight-note"
              type="text"
              placeholder="e.g., Morning weigh-in, post gym"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs text-stone-800 bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Guarantee notice */}
          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
            ✓ Preserves all existing weight history & meal records.
            <br />
            ✓ Automatically recalculates BMI and nutrition recommendations.
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              id="btn-cancel-weight-modal"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-log-weight"
              className="px-5 py-2 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs"
            >
              Record Weight ({weight} kg)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
