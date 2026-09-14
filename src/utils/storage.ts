import { MealRecord, UserProfile, WeightLogEntry } from '../types';
import { calculateBMI } from './nutrition';

const STORAGE_KEY_PROFILE = 'personal_nutrition_profile_v1';
const STORAGE_KEY_WEIGHT_LOGS = 'personal_nutrition_weight_logs_v1';
const STORAGE_KEY_MEALS = 'personal_nutrition_meals_v1';

export const DEFAULT_PROFILE: UserProfile = {
  currentWeight: 45,
  targetWeight: 55,
  initialWeight: 45,
  height: 165,
  age: 26,
  gender: 'female',
  activityLevel: 'moderate',
  dietaryPreference: 'balanced',
  lastUpdated: new Date().toISOString(),
};

// Helper for formatted date
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const INITIAL_WEIGHT_LOGS: WeightLogEntry[] = [
  {
    id: 'w-init-1',
    date: getTodayDateString(),
    time: '08:00',
    weight: 45,
    bmi: calculateBMI(45, 165),
    note: 'Initial baseline weight',
    timestamp: Date.now() - 86400000 * 2,
  },
];

export const INITIAL_MEALS: MealRecord[] = [
  {
    id: 'm-init-1',
    date: getTodayDateString(),
    time: '08:30',
    mealType: 'breakfast',
    name: 'Oatmeal with berries & chia seeds',
    calories: 380,
    protein: 14,
    carbs: 58,
    fat: 9,
    timestamp: Date.now() - 3600000 * 3,
  },
  {
    id: 'm-init-2',
    date: getTodayDateString(),
    time: '12:45',
    mealType: 'lunch',
    name: 'Grilled chicken quinoa power bowl with avocado',
    calories: 520,
    protein: 42,
    carbs: 48,
    fat: 16,
    timestamp: Date.now() - 3600000 * 1,
  },
];

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
      };
    }
  } catch (e) {
    console.error('Failed to load profile from storage:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to storage:', e);
  }
}

export function loadWeightLogs(): WeightLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WEIGHT_LOGS);
    if (raw) {
      const logs = JSON.parse(raw);
      if (Array.isArray(logs) && logs.length > 0) {
        return logs;
      }
    }
  } catch (e) {
    console.error('Failed to load weight logs from storage:', e);
  }
  return INITIAL_WEIGHT_LOGS;
}

export function saveWeightLogs(logs: WeightLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_WEIGHT_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save weight logs to storage:', e);
  }
}

export function loadMeals(): MealRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MEALS);
    if (raw) {
      const meals = JSON.parse(raw);
      if (Array.isArray(meals)) {
        return meals;
      }
    }
  } catch (e) {
    console.error('Failed to load meals from storage:', e);
  }
  return INITIAL_MEALS;
}

export function saveMeals(meals: MealRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_MEALS, JSON.stringify(meals));
  } catch (e) {
    console.error('Failed to save meals to storage:', e);
  }
}

export interface AppBackupData {
  version: number;
  exportedAt: string;
  profile: UserProfile;
  weightLogs: WeightLogEntry[];
  meals: MealRecord[];
}

export function exportBackupData(): string {
  const data: AppBackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: loadProfile(),
    weightLogs: loadWeightLogs(),
    meals: loadMeals(),
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; message: string } {
  try {
    const parsed = JSON.parse(jsonString) as Partial<AppBackupData>;
    if (!parsed.profile || !Array.isArray(parsed.weightLogs) || !Array.isArray(parsed.meals)) {
      return { success: false, message: 'Invalid file format: missing required tracker fields.' };
    }
    saveProfile(parsed.profile);
    saveWeightLogs(parsed.weightLogs);
    saveMeals(parsed.meals);
    return { success: true, message: 'Data restored successfully.' };
  } catch (e) {
    return { success: false, message: 'Failed to parse file: invalid JSON format.' };
  }
}
