import React, { useState } from 'react';
import { X, Check, Sliders, Info, Scale, Target, Shield, Heart } from 'lucide-react';
import { ActivityLevel, DietaryPreference, Gender, UserProfile } from '../types';
import { ACTIVITY_MULTIPLIERS, DIETARY_PREFERENCES } from '../utils/nutrition';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: UserProfile, appendWeightLog: boolean) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [currentWeight, setCurrentWeight] = useState<number>(profile.currentWeight);
  const [targetWeight, setTargetWeight] = useState<number>(profile.targetWeight);
  const [initialWeight, setInitialWeight] = useState<number>(profile.initialWeight);
  const [height, setHeight] = useState<number>(profile.height);
  const [age, setAge] = useState<number>(profile.age);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(profile.dietaryPreference);
  const [appendLog, setAppendLog] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightChanged = Number(currentWeight) !== Number(profile.currentWeight);
    const updated: UserProfile = {
      ...profile,
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      initialWeight: Number(initialWeight),
      height: Number(height),
      age: Number(age),
      gender,
      activityLevel,
      dietaryPreference,
      lastUpdated: new Date().toISOString(),
    };
    onSaveProfile(updated, weightChanged && appendLog);
    onClose();
  };

  const isWeightChanged = Number(currentWeight) !== Number(profile.currentWeight);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-stone-900">Profile & Dynamic Settings</h2>
              <p className="text-xs text-stone-500">Edit your personal metrics and target settings</p>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Weight Group */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5 text-emerald-600" />
              <span>Weight Settings (kg)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Current Weight */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-current-weight" className="text-xs font-medium text-stone-700">
                    Current Weight (kg)
                  </label>
                  <span className="text-[11px] text-emerald-700 font-medium">Editable anytime</span>
                </div>
                <div className="relative">
                  <input
                    id="input-current-weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-xl font-bold text-stone-900 bg-white border border-stone-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                    kg
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Updates BMI, progress & calorie/protein recommendations.
                </p>
              </div>

              {/* Target Weight */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-target-weight" className="text-xs font-medium text-stone-700">
                    Target Weight (kg)
                  </label>
                  <span className="text-[11px] text-stone-500">Goal Target</span>
                </div>
                <div className="relative">
                  <input
                    id="input-target-weight"
                    type="number"
                    step="0.1"
                    min="20"
                    max="300"
                    required
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                    className="w-full text-xl font-bold text-stone-900 bg-white border border-stone-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                    kg
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5">
                  Adjust target anytime to update your progress indicators.
                </p>
              </div>
            </div>

            {/* Checkbox to add weight log entry if current weight changed */}
            {isWeightChanged && (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5">
                <input
                  id="chk-append-weight-log"
                  type="checkbox"
                  checked={appendLog}
                  onChange={(e) => setAppendLog(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-emerald-600 border-stone-300 focus:ring-emerald-500"
                />
                <label htmlFor="chk-append-weight-log" className="text-xs text-emerald-950 font-normal">
                  <strong className="font-semibold text-emerald-900 block">Record in dated weight log</strong>
                  Automatically save this update ({currentWeight} kg) to your dated weight history timeline so you can track changes over time.
                </label>
              </div>
            )}
          </div>

          {/* Body Measurements & Vitals */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-emerald-600" />
              <span>Body Metrics & Biological Stats</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Height */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <label htmlFor="input-height" className="block text-xs font-medium text-stone-700 mb-1">
                  Height (cm)
                </label>
                <input
                  id="input-height"
                  type="number"
                  min="100"
                  max="250"
                  required
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Age */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <label htmlFor="input-age" className="block text-xs font-medium text-stone-700 mb-1">
                  Age (years)
                </label>
                <input
                  id="input-age"
                  type="number"
                  min="12"
                  max="120"
                  required
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Starting / Initial Weight */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <label htmlFor="input-initial-weight" className="block text-xs font-medium text-stone-700 mb-1">
                  Start Weight (kg)
                </label>
                <input
                  id="input-initial-weight"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  required
                  value={initialWeight}
                  onChange={(e) => setInitialWeight(parseFloat(e.target.value) || 0)}
                  className="w-full text-base font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Gender */}
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <label htmlFor="select-gender" className="block text-xs font-medium text-stone-700 mb-1">
                  Biological Sex
                </label>
                <select
                  id="select-gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full text-sm font-medium text-stone-900 bg-white border border-stone-300 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label htmlFor="select-activity-level" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Activity Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((levelKey) => {
                const item = ACTIVITY_MULTIPLIERS[levelKey];
                const isSelected = activityLevel === levelKey;
                return (
                  <button
                    key={levelKey}
                    type="button"
                    onClick={() => setActivityLevel(levelKey)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Preference */}
          <div className="space-y-2">
            <label htmlFor="select-dietary-preference" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(DIETARY_PREFERENCES) as DietaryPreference[]).map((dietKey) => {
                const item = DIETARY_PREFERENCES[dietKey];
                const isSelected = dietaryPreference === dietKey;
                return (
                  <button
                    key={dietKey}
                    type="button"
                    onClick={() => setDietaryPreference(dietKey)}
                    className={`text-left p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900">{item.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 px-3.5 py-2.5 rounded-xl border border-stone-200">
            <Shield className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Private & confidential. All data remains in your local browser storage.</span>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              id="btn-cancel-profile"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-save-profile"
              className="px-5 py-2 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors shadow-xs"
            >
              Save Profile & Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
