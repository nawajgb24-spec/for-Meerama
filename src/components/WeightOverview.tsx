import React, { useState } from 'react';
import { Scale, Target, TrendingUp, Info, Activity, Edit2, Check, ArrowRight, Sparkles } from 'lucide-react';
import { UserProfile, WeightProgressStats } from '../types';
import { BMICategory, calculateBMI, getBMICategory } from '../utils/nutrition';

interface WeightOverviewProps {
  profile: UserProfile;
  progressStats: WeightProgressStats;
  onOpenQuickWeight: () => void;
  onOpenProfile: () => void;
  onQuickUpdateWeight: (newWeight: number) => void;
  onUpdateTargetWeight: (newTarget: number) => void;
}

export const WeightOverview: React.FC<WeightOverviewProps> = ({
  profile,
  progressStats,
  onOpenQuickWeight,
  onOpenProfile,
  onQuickUpdateWeight,
  onUpdateTargetWeight,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(profile.targetWeight.toString());

  const [inlineWeightInput, setInlineWeightInput] = useState<string>('');

  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const bmiInfo: BMICategory = getBMICategory(bmi);

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(targetInput);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateTargetWeight(parsed);
      setIsEditingTarget(false);
    }
  };

  const handleInlineWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(inlineWeightInput);
    if (!isNaN(val) && val > 0) {
      onQuickUpdateWeight(val);
      setInlineWeightInput('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner with Quick Interactive Weight Buttons */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Sparkles className="w-3 h-3" /> Dynamic Weight Tracking
              </span>
              <span className="text-xs text-stone-600">Weight is never locked or fixed</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              Current Weight & Target Progress
            </h2>
          </div>

          {/* Prompt Example Quick Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-600 font-medium mr-1">Simulate updates:</span>
            {[45, 47, 50, 55].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => onQuickUpdateWeight(val)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  profile.currentWeight === val
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
                title={`Click to test setting weight to ${val} kg`}
              >
                {val} kg {profile.currentWeight === val && '✓'}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Major Status Cards: Current Weight, Target Weight, BMI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Card 1: Current Weight */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200 relative group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600" />
                Current Weight
              </span>
              <button
                id="btn-edit-current-weight"
                onClick={onOpenQuickWeight}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-stone-200 shadow-2xs"
              >
                <Edit2 className="w-3 h-3" />
                Update
              </button>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {profile.currentWeight}
              </span>
              <span className="text-sm font-semibold text-stone-600">kg</span>
            </div>

            <div className="mt-2 text-xs text-stone-600 flex items-center gap-1">
              <span>Start: <strong>{progressStats.initialWeight} kg</strong></span>
              <span className="text-stone-300">•</span>
              <span className={progressStats.progressKg >= 0 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                {progressStats.progressKg > 0 ? `+${progressStats.progressKg}` : progressStats.progressKg} kg change
              </span>
            </div>
          </div>

          {/* Card 2: Target Weight */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                Target Weight
              </span>
              {!isEditingTarget ? (
                <button
                  id="btn-inline-edit-target"
                  onClick={() => {
                    setTargetInput(profile.targetWeight.toString());
                    setIsEditingTarget(true);
                  }}
                  className="text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-stone-200 shadow-2xs"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit Target
                </button>
              ) : (
                <button
                  id="btn-inline-cancel-target"
                  onClick={() => setIsEditingTarget(false)}
                  className="text-xs text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditingTarget ? (
              <form onSubmit={handleSaveTarget} className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  autoFocus
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  className="w-24 text-xl font-bold bg-white border border-stone-300 rounded-lg px-2 py-1 text-stone-900 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
              </form>
            ) : (
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                  {profile.targetWeight}
                </span>
                <span className="text-sm font-semibold text-stone-600">kg</span>
              </div>
            )}

            <div className="mt-2 text-xs text-stone-600">
              {progressStats.isGoalReached ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Target reached!
                </span>
              ) : (
                <span>
                  <strong>{progressStats.remainingKg} kg</strong> remaining to reach goal
                </span>
              )}
            </div>
          </div>

          {/* Card 3: Dynamic BMI */}
          <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Body Mass Index (BMI)
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${bmiInfo.badgeClass}`}>
                {bmiInfo.category}
              </span>
            </div>

            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                {bmi}
              </span>
              <span className="text-xs text-stone-600">kg/m²</span>
            </div>

            <div className="mt-2 text-xs text-stone-600 flex items-center gap-1">
              <span>Height: {profile.height} cm</span>
              <span className="text-stone-300">•</span>
              <span>Healthy: 18.5–24.9</span>
            </div>
          </div>
        </div>

        {/* Progress Bar towards Target */}
        <div className="mt-5 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="font-medium text-stone-700">
              Progress to Target ({profile.targetWeight} kg)
            </span>
            <span className="font-semibold text-stone-900">
              {progressStats.progressPercent}% Completed
            </span>
          </div>

          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressStats.isGoalReached
                  ? 'bg-emerald-600'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(4, progressStats.progressPercent))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-600 mt-2">
            <span>Start: {progressStats.initialWeight} kg</span>
            <span className="font-medium text-stone-800">
              Current: {profile.currentWeight} kg
            </span>
            <span>Target: {profile.targetWeight} kg</span>
          </div>
        </div>

        {/* Quick Inline Log Bar on Mobile / Desktop */}
        <div className="mt-4 pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <form onSubmit={handleInlineWeightSubmit} className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-xs">
              <input
                type="number"
                step="0.1"
                min="20"
                max="300"
                placeholder={`New weight (e.g. ${profile.currentWeight + 0.5})`}
                value={inlineWeightInput}
                onChange={(e) => setInlineWeightInput(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg pl-3 pr-8 py-1.5 focus:ring-2 focus:ring-emerald-500 text-stone-900 placeholder:text-stone-400"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-600">kg</span>
            </div>
            <button
              type="submit"
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
            >
              Update Weight
            </button>
          </form>

          <button
            type="button"
            onClick={onOpenProfile}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium self-end sm:self-auto flex items-center gap-1"
          >
            Adjust height, age & activity in Profile <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
