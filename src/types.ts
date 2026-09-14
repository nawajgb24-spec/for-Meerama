export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';

export type DietaryPreference = 
  | 'balanced' 
  | 'high_protein' 
  | 'low_carb' 
  | 'vegetarian' 
  | 'vegan' 
  | 'mediterranean';

export type Gender = 'female' | 'male';

export interface UserProfile {
  currentWeight: number; // in kg
  targetWeight: number; // in kg
  initialWeight: number; // in kg
  height: number; // in cm
  age: number; // years
  gender: Gender;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  lastUpdated: string; // ISO date string
}

export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  weight: number; // kg
  bmi: number;
  note?: string;
  timestamp: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  mealType: MealType;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  timestamp: number;
}

export interface NutritionRecommendations {
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  goalType: 'gain' | 'loss' | 'maintain';
  calorieAdjustment: number;
  recommendedCaloriesReason: string;
  recommendedProteinReason: string;
}

export interface WeightProgressStats {
  initialWeight: number;
  currentWeight: number;
  targetWeight: number;
  goalType: 'gain' | 'loss' | 'maintain';
  remainingKg: number;
  progressKg: number;
  progressPercent: number;
  isGoalReached: boolean;
}
