export interface Athlete {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  disabilityType: string;
  sport: string;
  trainingHours: number;
  sleepHours: number;
  weightKg: number;
  heightCm: number;
  heartRateRest: number;
  dailyCalorieIntake: number;
  proteinIntakeG: number;
  waterIntakeLiters: number;
  hydrationLevel: number;
  avatar?: string;
}

export interface Prediction {
  athleteId: string;
  stamina: number;
  staminaLevel: number; // Backend returns stamina_level as number
  fatigueLevel: 'Low' | 'Medium' | 'High';
  fatigueLevelValue: number; // Backend returns fatigue_level as number
  injuryRisk: 'Low' | 'Moderate' | 'High';
  injuryRiskScore: number; // Backend returns injury_risk_score as number
  lastUpdated: Date;
}

export interface Message {
  id: string;
  sender: 'coach' | 'athlete';
  content: string;
  timestamp: Date;
  athleteId?: string;
}

export interface NutritionRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export interface FormData {
  name: string;
  age: string;
  gender: string;
  disabilityType: string;
  sport: string;
  trainingHours: string;
  sleepHours: string;
  weightKg: string;
  heightCm: string;
  heartRateRest: string;
  dailyCalorieIntake: string;
  proteinIntakeG: string;
  waterIntakeLiters: string;
  hydrationLevel: string;
}

export interface ValidationErrors {
  [key: string]: string;
}