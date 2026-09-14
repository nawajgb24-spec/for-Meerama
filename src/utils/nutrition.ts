import { ActivityLevel, DietaryPreference, Gender, NutritionRecommendations, UserProfile, WeightProgressStats } from '../types';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { factor: number; label: string; description: string }> = {
  sedentary: {
    factor: 1.2,
    label: 'Sedentary',
    description: 'Little or no daily exercise, desk routine',
  },
  light: {
    factor: 1.375,
    label: 'Lightly Active',
    description: 'Light exercise or sports 1–3 days per week',
  },
  moderate: {
    factor: 1.55,
    label: 'Moderately Active',
    description: 'Moderate exercise or training 3–5 days per week',
  },
  very: {
    factor: 1.725,
    label: 'Very Active',
    description: 'Hard training or intense sports 6–7 days per week',
  },
  extra: {
    factor: 1.9,
    label: 'Extra Active',
    description: 'Very heavy physical work or multi-session athletic training',
  },
};

export const DIETARY_PREFERENCES: Record<DietaryPreference, { label: string; description: string }> = {
  balanced: {
    label: 'Balanced',
    description: 'Balanced distribution of whole carbs, lean proteins, and fats',
  },
  high_protein: {
    label: 'High Protein',
    description: 'Elevated protein to support muscle synthesis and satiety',
  },
  low_carb: {
    label: 'Low Carb',
    description: 'Reduced carbohydrates with higher wholesome healthy fats',
  },
  mediterranean: {
    label: 'Mediterranean',
    description: 'Rich in vegetables, whole grains, seafood, and olive oil',
  },
  vegetarian: {
    label: 'Vegetarian',
    description: 'Plant-forward nutrition with dairy and eggs',
  },
  vegan: {
    label: 'Vegan',
    description: 'Strictly 100% plant-derived nourishment',
  },
};

/**
 * Calculates Body Mass Index (BMI).
 * BMI = weight (kg) / (height (m))^2
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (weightKg <= 0 || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

export interface BMICategory {
  category: string;
  badgeClass: string;
  textClass: string;
  minRange: number;
  maxRange: number;
  description: string;
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi <= 0) {
    return {
      category: 'Unknown',
      badgeClass: 'bg-stone-100 text-stone-600',
      textClass: 'text-stone-600',
      minRange: 0,
      maxRange: 0,
      description: 'Enter weight & height to calculate',
    };
  }
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      textClass: 'text-amber-700',
      minRange: 0,
      maxRange: 18.4,
      description: 'Below typical healthy range (< 18.5)',
    };
  }
  if (bmi <= 24.9) {
    return {
      category: 'Normal weight',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      textClass: 'text-emerald-700',
      minRange: 18.5,
      maxRange: 24.9,
      description: 'Optimal healthy range (18.5 – 24.9)',
    };
  }
  if (bmi <= 29.9) {
    return {
      category: 'Overweight',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      textClass: 'text-amber-700',
      minRange: 25.0,
      maxRange: 29.9,
      description: 'Above optimal weight range (25.0 – 29.9)',
    };
  }
  return {
    category: 'Obese',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    textClass: 'text-rose-700',
    minRange: 30.0,
    maxRange: 50.0,
    description: 'Significantly elevated range (≥ 30.0)',
  };
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation
 */
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 0;
  // Mifflin-St Jeor:
  // Male: 10 * weight + 6.25 * height - 5 * age + 5
  // Female: 10 * weight + 6.25 * height - 5 * age - 161
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

/**
 * Dynamically calculates nutrition recommendations based on user profile, current weight, and target weight
 */
export function calculateRecommendations(profile: UserProfile): NutritionRecommendations {
  const { currentWeight, targetWeight, height, age, gender, activityLevel, dietaryPreference } = profile;
  
  const bmr = calculateBMR(currentWeight, height, age, gender);
  const activity = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  const tdee = Math.round(bmr * activity.factor);

  let goalType: 'gain' | 'loss' | 'maintain' = 'maintain';
  let calorieAdjustment = 0;
  let recommendedCaloriesReason = '';

  const diff = targetWeight - currentWeight;

  if (diff > 0.5) {
    goalType = 'gain';
    // Gentle surplus of 350-400 kcal for steady lean mass gain
    calorieAdjustment = 375;
    recommendedCaloriesReason = `Moderate caloric surplus (+375 kcal) for steady healthy gain toward ${targetWeight} kg.`;
  } else if (diff < -0.5) {
    goalType = 'loss';
    // Gentle deficit of 400 kcal
    calorieAdjustment = -400;
    recommendedCaloriesReason = `Controlled caloric deficit (-400 kcal) for gradual sustainable loss toward ${targetWeight} kg.`;
  } else {
    goalType = 'maintain';
    calorieAdjustment = 0;
    recommendedCaloriesReason = `Maintenance intake aligned with current weight of ${currentWeight} kg.`;
  }

  const targetCalories = Math.max(1200, Math.round(tdee + calorieAdjustment));

  // Protein calculation based on current weight (g/kg) and activity/preference
  let proteinFactor = 1.6; // default g per kg
  if (dietaryPreference === 'high_protein') {
    proteinFactor = goalType === 'gain' ? 2.0 : 1.9;
  } else if (goalType === 'gain') {
    proteinFactor = activityLevel === 'very' || activityLevel === 'extra' ? 2.0 : 1.8;
  } else if (goalType === 'loss') {
    proteinFactor = 1.8; // higher protein helps protect lean mass during deficit
  } else {
    // maintain
    proteinFactor = activityLevel === 'sedentary' ? 1.3 : 1.6;
  }

  const targetProtein = Math.round(currentWeight * proteinFactor);
  const recommendedProteinReason = `${proteinFactor.toFixed(1)}g per kg body weight based on current ${currentWeight} kg and ${activity.label.toLowerCase()} lifestyle.`;

  // Calculate remaining macros (Carbs and Fats) based on calorie allocation
  const proteinCalories = targetProtein * 4;
  const remainingCalories = Math.max(0, targetCalories - proteinCalories);

  let targetCarbs = 0;
  let targetFat = 0;

  if (dietaryPreference === 'low_carb') {
    // Low carb: 25% carbs, 75% fats of remainder
    targetCarbs = Math.round((remainingCalories * 0.25) / 4);
    targetFat = Math.round((remainingCalories * 0.75) / 9);
  } else if (dietaryPreference === 'high_protein') {
    // High protein: 55% carbs, 45% fats of remainder
    targetCarbs = Math.round((remainingCalories * 0.55) / 4);
    targetFat = Math.round((remainingCalories * 0.45) / 9);
  } else {
    // Balanced / Mediterranean / Veg
    targetCarbs = Math.round((remainingCalories * 0.60) / 4);
    targetFat = Math.round((remainingCalories * 0.40) / 9);
  }

  return {
    bmr,
    tdee,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    goalType,
    calorieAdjustment,
    recommendedCaloriesReason,
    recommendedProteinReason,
  };
}

/**
 * Calculates weight progress stats relative to starting weight and target weight
 */
export function calculateWeightProgress(
  initialWeight: number,
  currentWeight: number,
  targetWeight: number
): WeightProgressStats {
  const isGain = targetWeight > initialWeight;
  const isLoss = targetWeight < initialWeight;
  const isMaintain = targetWeight === initialWeight;

  const goalType: 'gain' | 'loss' | 'maintain' = isGain ? 'gain' : isLoss ? 'loss' : 'maintain';
  const remainingKg = Number(Math.abs(targetWeight - currentWeight).toFixed(1));

  let progressKg = 0;
  let progressPercent = 0;
  let isGoalReached = false;

  if (isMaintain) {
    const diff = Math.abs(currentWeight - targetWeight);
    isGoalReached = diff <= 0.5;
    progressPercent = isGoalReached ? 100 : Math.max(0, 100 - diff * 20);
    progressKg = Number((currentWeight - initialWeight).toFixed(1));
  } else if (isGain) {
    const totalDistance = targetWeight - initialWeight;
    const distanceTraveled = currentWeight - initialWeight;
    progressKg = Number(distanceTraveled.toFixed(1));
    isGoalReached = currentWeight >= targetWeight;

    if (totalDistance > 0) {
      const rawPercent = (distanceTraveled / totalDistance) * 100;
      progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
    }
  } else {
    // Loss
    const totalDistance = initialWeight - targetWeight;
    const distanceTraveled = initialWeight - currentWeight;
    progressKg = Number(distanceTraveled.toFixed(1));
    isGoalReached = currentWeight <= targetWeight;

    if (totalDistance > 0) {
      const rawPercent = (distanceTraveled / totalDistance) * 100;
      progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
    }
  }

  return {
    initialWeight,
    currentWeight,
    targetWeight,
    goalType,
    remainingKg,
    progressKg,
    progressPercent,
    isGoalReached,
  };
}
