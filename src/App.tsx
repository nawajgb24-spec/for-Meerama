import React, { useState, useMemo } from 'react';
import { UserProfile, WeightLogEntry, MealRecord } from './types';
import {
  DEFAULT_PROFILE,
  INITIAL_WEIGHT_LOGS,
  INITIAL_MEALS,
  loadProfile,
  saveProfile,
  loadWeightLogs,
  saveWeightLogs,
  loadMeals,
  saveMeals,
  getTodayDateString,
  getCurrentTimeString,
} from './utils/storage';
import { calculateBMI, calculateRecommendations, calculateWeightProgress } from './utils/nutrition';
import { Header } from './components/Header';
import { WeightOverview } from './components/WeightOverview';
import { WeightChart } from './components/WeightChart';
import { WeightHistoryList } from './components/WeightHistoryList';
import { DailyNutritionSummary } from './components/DailyNutritionSummary';
import { MealTracker } from './components/MealTracker';
import { ProfileModal } from './components/ProfileModal';
import { QuickWeightModal } from './components/QuickWeightModal';
import { DataBackupModal } from './components/DataBackupModal';
import { Lock, Smartphone, Heart, Sparkles, Scale, Info } from 'lucide-react';

export default function App() {
  // Persistent State
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() => loadWeightLogs());
  const [meals, setMeals] = useState<MealRecord[]>(() => loadMeals());

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isQuickWeightOpen, setIsQuickWeightOpen] = useState<boolean>(false);
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);

  // Computed Nutrition Recommendations & Weight Progress
  const recommendations = useMemo(() => {
    return calculateRecommendations(profile);
  }, [profile]);

  const progressStats = useMemo(() => {
    return calculateWeightProgress(profile.initialWeight, profile.currentWeight, profile.targetWeight);
  }, [profile.initialWeight, profile.currentWeight, profile.targetWeight]);

  // Today's consumed nutrition
  const todayDate = getTodayDateString();
  const todayConsumed = useMemo(() => {
    const todaysMeals = meals.filter((m) => m.date === todayDate);
    return todaysMeals.reduce(
      (acc, m) => {
        acc.calories += m.calories || 0;
        acc.protein += m.protein || 0;
        acc.carbs += m.carbs || 0;
        acc.fat += m.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals, todayDate]);

  // Handle Profile Save
  const handleSaveProfile = (updated: UserProfile, appendWeightLog: boolean) => {
    setProfile(updated);
    saveProfile(updated);

    if (appendWeightLog) {
      const newEntry: WeightLogEntry = {
        id: `w-${Date.now()}`,
        date: getTodayDateString(),
        time: getCurrentTimeString(),
        weight: updated.currentWeight,
        bmi: calculateBMI(updated.currentWeight, updated.height),
        note: 'Updated from profile settings',
        timestamp: Date.now(),
      };
      const updatedLogs = [newEntry, ...weightLogs];
      setWeightLogs(updatedLogs);
      saveWeightLogs(updatedLogs);
    }
  };

  // Handle Quick Weight Log
  const handleLogWeight = (weight: number, date: string, time: string, note?: string) => {
    const updatedProfile: UserProfile = {
      ...profile,
      currentWeight: weight,
      lastUpdated: new Date().toISOString(),
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);

    const newEntry: WeightLogEntry = {
      id: `w-${Date.now()}`,
      date,
      time,
      weight,
      bmi: calculateBMI(weight, profile.height),
      note,
      timestamp: Date.now(),
    };

    const updatedLogs = [newEntry, ...weightLogs];
    setWeightLogs(updatedLogs);
    saveWeightLogs(updatedLogs);
  };

  // Quick weight update via prompt example buttons (45, 47, 50, 55 kg or inline input)
  const handleQuickUpdateWeight = (newWeight: number) => {
    if (newWeight <= 0) return;
    handleLogWeight(newWeight, getTodayDateString(), getCurrentTimeString(), 'Quick weight check-in');
  };

  // Handle inline target weight change
  const handleUpdateTargetWeight = (newTarget: number) => {
    if (newTarget <= 0) return;
    const updatedProfile: UserProfile = {
      ...profile,
      targetWeight: newTarget,
      lastUpdated: new Date().toISOString(),
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Handle Add Meal
  const handleAddMeal = (mealData: Omit<MealRecord, 'id' | 'timestamp'>) => {
    const newMeal: MealRecord = {
      ...mealData,
      id: `m-${Date.now()}`,
      timestamp: Date.now(),
    };
    const updatedMeals = [newMeal, ...meals];
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  // Handle Delete Meal
  const handleDeleteMeal = (mealId: string) => {
    const updatedMeals = meals.filter((m) => m.id !== mealId);
    setMeals(updatedMeals);
    saveMeals(updatedMeals);
  };

  // Handle Delete Weight Log
  const handleDeleteWeightLog = (logId: string) => {
    const updatedLogs = weightLogs.filter((l) => l.id !== logId);
    setWeightLogs(updatedLogs);
    saveWeightLogs(updatedLogs);
  };

  // Handle Manual Historical Weight Log
  const handleAddManualLog = (weight: number, date: string, time: string, note?: string) => {
    const newEntry: WeightLogEntry = {
      id: `w-${Date.now()}`,
      date,
      time,
      weight,
      bmi: calculateBMI(weight, profile.height),
      note,
      timestamp: new Date(`${date}T${time}`).getTime() || Date.now(),
    };
    const updatedLogs = [newEntry, ...weightLogs];
    setWeightLogs(updatedLogs);
    saveWeightLogs(updatedLogs);
  };

  // Reset to Baseline
  const handleResetDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    saveProfile(DEFAULT_PROFILE);
    setWeightLogs(INITIAL_WEIGHT_LOGS);
    saveWeightLogs(INITIAL_WEIGHT_LOGS);
    setMeals(INITIAL_MEALS);
    saveMeals(INITIAL_MEALS);
  };

  // Refresh all state on backup restore
  const handleDataRestored = () => {
    setProfile(loadProfile());
    setWeightLogs(loadWeightLogs());
    setMeals(loadMeals());
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans antialiased pb-16">
      {/* Top Header */}
      <Header
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenQuickWeight={() => setIsQuickWeightOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        currentWeight={profile.currentWeight}
        targetWeight={profile.targetWeight}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Dynamic Weight Hero & Progress Component */}
        <section aria-label="Current Weight and Target Progress">
          <WeightOverview
            profile={profile}
            progressStats={progressStats}
            onOpenQuickWeight={() => setIsQuickWeightOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onQuickUpdateWeight={handleQuickUpdateWeight}
            onUpdateTargetWeight={handleUpdateTargetWeight}
          />
        </section>

        {/* Dynamic Nutrition Recommendations & Today's Intake */}
        <section aria-label="Dynamic Nutrition Targets">
          <DailyNutritionSummary
            profile={profile}
            recommendations={recommendations}
            consumed={todayConsumed}
          />
        </section>

        {/* Meal Tracking (Meals kept safe across weight updates) */}
        <section aria-label="Personal Daily Meal Log">
          <MealTracker
            meals={meals}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        </section>

        {/* Dated Weight Log Trend & History */}
        <section aria-label="Dated Weight Log and Trend" className="space-y-6">
          <WeightChart
            logs={weightLogs}
            targetWeight={profile.targetWeight}
          />

          <WeightHistoryList
            logs={weightLogs}
            onDeleteLog={handleDeleteWeightLog}
            onAddManualLog={handleAddManualLog}
          />
        </section>

        {/* Mobile App Footer & Privacy Guarantee */}
        <footer className="pt-6 border-t border-stone-200 text-center text-xs text-stone-500 space-y-2">
          <div className="flex items-center justify-center gap-1.5 font-medium text-stone-600">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private Personal Tracker</span>
            <span>•</span>
            <Smartphone className="w-3.5 h-3.5 text-stone-400" />
            <span>Mobile-ready personal tool</span>
          </div>
          <p className="max-w-md mx-auto text-[11px] text-stone-600">
            All profile settings, weight changes, and meal records remain strictly in your browser's local storage. No external servers or public directories.
          </p>
        </footer>
      </main>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <QuickWeightModal
        isOpen={isQuickWeightOpen}
        onClose={() => setIsQuickWeightOpen(false)}
        currentWeight={profile.currentWeight}
        targetWeight={profile.targetWeight}
        onLogWeight={handleLogWeight}
      />

      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataRestored={handleDataRestored}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
