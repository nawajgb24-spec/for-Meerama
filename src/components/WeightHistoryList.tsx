import React, { useState } from 'react';
import { WeightLogEntry } from '../types';
import { Calendar, Clock, Trash2, Plus, ArrowUpRight, ArrowDownRight, Minus, FileText } from 'lucide-react';
import { getBMICategory } from '../utils/nutrition';

interface WeightHistoryListProps {
  logs: WeightLogEntry[];
  onDeleteLog: (id: string) => void;
  onAddManualLog: (weight: number, date: string, time: string, note?: string) => void;
}

export const WeightHistoryList: React.FC<WeightHistoryListProps> = ({
  logs,
  onDeleteLog,
  onAddManualLog,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('08:00');
  const [newNote, setNewNote] = useState('');

  // Sort logs descending (newest first)
  const sorted = [...logs].sort((a, b) => b.timestamp - a.timestamp);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeight);
    if (!isNaN(val) && val > 0) {
      onAddManualLog(val, newDate, newTime, newNote.trim() || undefined);
      setNewWeight('');
      setNewNote('');
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Dated Weight Log History</h3>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
              {logs.length} {logs.length === 1 ? 'record' : 'records'}
            </span>
          </div>
          <p className="text-xs text-stone-500">Historical records are kept safely as weight updates</p>
        </div>

        <button
          id="btn-add-past-weight"
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200"
        >
          <Plus className="w-3.5 h-3.5" />
          {isAdding ? 'Close Form' : 'Add Past Log'}
        </button>
      </div>

      {/* Manual Entry Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mt-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="text-xs font-semibold text-stone-800">Add Backdated Weight Entry</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
            <div>
              <label htmlFor="input-manual-weight" className="block text-[11px] font-medium text-stone-600 mb-1">Weight (kg)</label>
              <input
                id="input-manual-weight"
                type="number"
                step="0.1"
                min="20"
                max="300"
                required
                placeholder="e.g. 48.5"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="w-full text-xs font-semibold bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-manual-date" className="block text-[11px] font-medium text-stone-600 mb-1">Date</label>
              <input
                id="input-manual-date"
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-manual-time" className="block text-[11px] font-medium text-stone-600 mb-1">Time</label>
              <input
                id="input-manual-time"
                type="time"
                required
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-manual-note" className="block text-[11px] font-medium text-stone-600 mb-1">Note</label>
              <input
                id="input-manual-note"
                type="text"
                placeholder="e.g. Post weekend"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-2xs"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="mt-4 divide-y divide-stone-100 max-h-80 overflow-y-auto">
        {sorted.map((log, index) => {
          // Compare with chronological previous (which is sorted[index + 1] since sorted is desc)
          const prevLog = sorted[index + 1];
          const diff = prevLog ? Number((log.weight - prevLog.weight).toFixed(1)) : null;
          const bmiInfo = getBMICategory(log.bmi);

          return (
            <div
              key={log.id}
              className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/70 px-2 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                {/* Weight badge */}
                <div className="min-w-[70px]">
                  <span className="text-base font-extrabold text-stone-900 tracking-tight">
                    {log.weight}
                  </span>
                  <span className="text-xs text-stone-500 ml-1 font-semibold">kg</span>
                </div>

                {/* Trend diff */}
                <div className="min-w-[80px]">
                  {diff === null ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] text-stone-400">
                      <Minus className="w-3 h-3" /> Baseline
                    </span>
                  ) : diff > 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <ArrowUpRight className="w-3 h-3" /> +{diff} kg
                    </span>
                  ) : diff < 0 ? (
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <ArrowDownRight className="w-3 h-3" /> {diff} kg
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400">0.0 kg</span>
                  )}
                </div>

                {/* Date & BMI */}
                <div className="text-xs text-stone-600">
                  <div className="flex items-center gap-1.5 font-medium text-stone-800">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>{log.date}</span>
                    <span className="text-stone-300">•</span>
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{log.time}</span>
                  </div>
                  {log.note && (
                    <p className="text-[11px] text-stone-500 italic mt-0.5">"{log.note}"</p>
                  )}
                </div>
              </div>

              {/* Right side BMI tag & delete */}
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${bmiInfo.badgeClass}`}>
                  BMI {log.bmi}
                </span>

                {logs.length > 1 && (
                  <button
                    onClick={() => onDeleteLog(log.id)}
                    className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete this entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
