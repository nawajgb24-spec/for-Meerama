import React, { useState } from 'react';
import { MealRecord, MealType } from '../types';
import { Utensils, Plus, Trash2, Calendar, Coffee, Sun, Moon, Apple, ShieldCheck } from 'lucide-react';
import { getTodayDateString, getCurrentTimeString } from '../utils/storage';

interface MealTrackerProps {
  meals: MealRecord[];
  onAddMeal: (meal: Omit<MealRecord, 'id' | 'timestamp'>) => void;
  onDeleteMeal: (id: string) => void;
}

const MEAL_TYPE_CONFIG: Record<MealType, { label: string; icon: React.ReactNode; color: string }> = {
  breakfast: {
    label: 'Breakfast',
    icon: <Coffee className="w-3.5 h-3.5" />,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  lunch: {
    label: 'Lunch',
    icon: <Sun className="w-3.5 h-3.5" />,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  dinner: {
    label: 'Dinner',
    icon: <Moon className="w-3.5 h-3.5" />,
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  snack: {
    label: 'Snacks & Extras',
    icon: <Apple className="w-3.5 h-3.5" />,
    color: 'text-rose-700 bg-rose-50 border-rose-200',
  },
};

export const MealTracker: React.FC<MealTrackerProps> = ({
  meals,
  onAddMeal,
  onDeleteMeal,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isAdding, setIsAdding] = useState(false);

  // New meal form state
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const filteredMeals = meals.filter((m) => m.date === selectedDate);

  const dayTotal = filteredMeals.reduce(
    (acc, m) => {
      acc.calories += m.calories || 0;
      acc.protein += m.protein || 0;
      acc.carbs += m.carbs || 0;
      acc.fat += m.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMeal({
      date: selectedDate,
      time: getCurrentTimeString(),
      mealType,
      name: name.trim(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
    });

    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setIsAdding(false);
  };

  const isToday = selectedDate === getTodayDateString();

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
      {/* Header & Date Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Personal Daily Meal Log</h3>
            <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              {filteredMeals.length} {filteredMeals.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Meals are preserved intact when updating weight or targets
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={() => setSelectedDate(getTodayDateString())}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-200"
            >
              Go to Today
            </button>
          )}

          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium text-stone-800 focus:outline-hidden cursor-pointer"
            />
          </div>

          <button
            id="btn-add-meal-toggle"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAdding ? 'Cancel' : 'Log Food'}
          </button>
        </div>
      </div>

      {/* Add Meal Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
          <div className="font-semibold text-xs text-stone-800">
            Log Meal for {selectedDate}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-meal-name" className="block text-[11px] font-medium text-stone-600 mb-1">
                Meal / Food Description
              </label>
              <input
                id="input-meal-name"
                type="text"
                required
                placeholder="e.g., Greek yogurt with honey & almonds"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="select-meal-category" className="block text-[11px] font-medium text-stone-600 mb-1">
                Category
              </label>
              <select
                id="select-meal-category"
                value={mealType}
                onChange={(e) => setMealType(e.target.value as MealType)}
                className="w-full text-xs font-medium bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snacks & Extras</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label htmlFor="input-meal-calories" className="block text-[11px] font-medium text-stone-600 mb-1">Calories (kcal)</label>
              <input
                id="input-meal-calories"
                type="number"
                min="0"
                required
                placeholder="e.g. 450"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-meal-protein" className="block text-[11px] font-medium text-stone-600 mb-1">Protein (g)</label>
              <input
                id="input-meal-protein"
                type="number"
                min="0"
                placeholder="e.g. 30"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-meal-carbs" className="block text-[11px] font-medium text-stone-600 mb-1">Carbs (g)</label>
              <input
                id="input-meal-carbs"
                type="number"
                min="0"
                placeholder="e.g. 45"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="input-meal-fat" className="block text-[11px] font-medium text-stone-600 mb-1">Fat (g)</label>
              <input
                id="input-meal-fat"
                type="number"
                min="0"
                placeholder="e.g. 15"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
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
              Add Meal
            </button>
          </div>
        </form>
      )}

      {/* Meals List for Selected Date */}
      {filteredMeals.length === 0 ? (
        <div className="py-8 text-center bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
          <Utensils className="w-6 h-6 text-stone-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-stone-600">No meals logged for {selectedDate}</p>
          <p className="text-[11px] text-stone-600 mt-0.5">Click "Log Food" above to record your breakfast, lunch, dinner or snack.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMeals.map((meal) => {
            const cat = MEAL_TYPE_CONFIG[meal.mealType] || MEAL_TYPE_CONFIG.breakfast;
            return (
              <div
                key={meal.id}
                className="p-3 bg-stone-50/60 hover:bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${cat.color} shrink-0`}>
                    {cat.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900">{meal.name}</span>
                      <span className="text-[10px] text-stone-600">{meal.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span className="font-semibold text-stone-700">{meal.calories} kcal</span>
                      <span>•</span>
                      <span>P: {meal.protein}g</span>
                      <span>•</span>
                      <span>C: {meal.carbs}g</span>
                      <span>•</span>
                      <span>F: {meal.fat}g</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="p-1.5 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove this meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          {/* Day Total Footnote */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600 px-2 font-medium">
            <span>Total for {selectedDate}:</span>
            <div className="flex items-center gap-3">
              <span><strong>{dayTotal.calories}</strong> kcal</span>
              <span><strong>{dayTotal.protein}g</strong> protein</span>
              <span><strong>{dayTotal.carbs}g</strong> carbs</span>
              <span><strong>{dayTotal.fat}g</strong> fat</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
