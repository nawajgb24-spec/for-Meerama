import React from 'react';
import { NutritionRecommendations, UserProfile } from '../types';
import { Flame, Beef, Wheat, Droplets, Info, Sparkles } from 'lucide-react';
import { DIETARY_PREFERENCES } from '../utils/nutrition';

interface DailyNutritionSummaryProps {
  profile: UserProfile;
  recommendations: NutritionRecommendations;
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const DailyNutritionSummary: React.FC<DailyNutritionSummaryProps> = ({
  profile,
  recommendations,
  consumed,
}) => {
  const calPercent = Math.min(100, Math.round((consumed.calories / recommendations.targetCalories) * 100));
  const proteinPercent = Math.min(100, Math.round((consumed.protein / recommendations.targetProtein) * 100));
  const carbsPercent = Math.min(100, Math.round((consumed.carbs / (recommendations.targetCarbs || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumed.fat / (recommendations.targetFat || 1)) * 100));

  const dietInfo = DIETARY_PREFERENCES[profile.dietaryPreference];

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Dynamic Nutrition Targets</h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Sparkles className="w-3 h-3" /> Auto-Recalculated
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Calorie and protein targets dynamically adjust to your current weight ({profile.currentWeight} kg)
          </p>
        </div>

        <div className="text-xs font-medium text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
          Diet: <span className="text-stone-900 font-semibold">{dietInfo?.label || 'Balanced'}</span>
        </div>
      </div>

      {/* Rationale Explainers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Calorie Recommendation Formula</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            {recommendations.recommendedCaloriesReason} (BMR: {recommendations.bmr} kcal • TDEE: {recommendations.tdee} kcal).
          </p>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div className="font-semibold text-stone-800 flex items-center gap-1.5 mb-1">
            <Beef className="w-3.5 h-3.5 text-emerald-600" />
            <span>Protein Recommendation Basis</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            {recommendations.recommendedProteinReason}
          </p>
        </div>
      </div>

      {/* Target vs Consumed Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Calories */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
            <span className="font-medium flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Calories
            </span>
            <span className="font-semibold text-stone-700">{calPercent}%</span>
          </div>
          <div className="text-xl font-bold text-stone-900">
            {consumed.calories} <span className="text-xs font-normal text-stone-500">/ {recommendations.targetCalories} kcal</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-300"
              style={{ width: `${calPercent}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
            <span className="font-medium flex items-center gap-1">
              <Beef className="w-3.5 h-3.5 text-emerald-600" /> Protein
            </span>
            <span className="font-semibold text-stone-700">{proteinPercent}%</span>
          </div>
          <div className="text-xl font-bold text-stone-900">
            {consumed.protein}g <span className="text-xs font-normal text-stone-500">/ {recommendations.targetProtein}g</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
            <span className="font-medium flex items-center gap-1">
              <Wheat className="w-3.5 h-3.5 text-amber-600" /> Carbs
            </span>
            <span className="font-semibold text-stone-700">{carbsPercent}%</span>
          </div>
          <div className="text-xl font-bold text-stone-900">
            {consumed.carbs}g <span className="text-xs font-normal text-stone-500">/ {recommendations.targetCarbs}g</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-amber-600 rounded-full transition-all duration-300"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>

        {/* Fats */}
        <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
            <span className="font-medium flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-500" /> Fats
            </span>
            <span className="font-semibold text-stone-700">{fatPercent}%</span>
          </div>
          <div className="text-xl font-bold text-stone-900">
            {consumed.fat}g <span className="text-xs font-normal text-stone-500">/ {recommendations.targetFat}g</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
