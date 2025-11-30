/**
 * API service for communicating with the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export interface BackendPredictionRequest {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  disability_type: 'Amputation' | 'Visual Impairment' | 'Cerebral Palsy' | 'Spinal Cord Injury' | 'Intellectual Impairment';
  sport_type: 'Wheelchair Racing' | 'Para Swimming' | 'Para Powerlifting' | 'Para Athletics (Track)' | 'Para Archery';
  weight_kg: number;
  height_cm: number;
  training_days_per_week: number;
  sleep_hours: number;
  heart_rate_rest: number;
  daily_calorie_intake: number;
  protein_intake_g: number;
  water_intake_liters: number;
  hydration_level?: number;
}

export interface BackendPredictionResponse {
  input: BackendPredictionRequest;
  predictions: {
    stamina_level: number;
    fatigue_level: number;
    injury_risk_score: number;
    injury_risk_label: 'Low' | 'Moderate' | 'High';
  };
}

export interface CoachChatRequest {
  athlete_data: BackendPredictionRequest;
  predictions: BackendPredictionResponse['predictions'];
  conversation_history?: string;
  user_question: string;
}

export interface CoachChatResponse {
  response: string;
  question: string;
}

export interface ApiError {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

/**
 * Map frontend disability type to backend format
 */
export function mapDisabilityType(frontendType: string): BackendPredictionRequest['disability_type'] {
  const mapping: Record<string, BackendPredictionRequest['disability_type']> = {
    'lower-limb': 'Amputation',
    'upper-limb': 'Amputation',
    'visual': 'Visual Impairment',
    'cerebral-palsy': 'Cerebral Palsy',
    'spinal-cord': 'Spinal Cord Injury',
    'other': 'Amputation',
  };
  return mapping[frontendType] || 'Amputation';
}

/**
 * Map frontend sport to backend format
 */
export function mapSportType(frontendSport: string): BackendPredictionRequest['sport_type'] {
  const sportLower = frontendSport.toLowerCase();
  
  if (sportLower.includes('wheelchair') && sportLower.includes('racing')) {
    return 'Wheelchair Racing';
  }
  if (sportLower.includes('swimming') || sportLower.includes('para swimming')) {
    return 'Para Swimming';
  }
  if (sportLower.includes('powerlifting') || sportLower.includes('para powerlifting')) {
    return 'Para Powerlifting';
  }
  if (sportLower.includes('archery') || sportLower.includes('para archery')) {
    return 'Para Archery';
  }
  if (sportLower.includes('athletics') || sportLower.includes('track') || sportLower.includes('sprint')) {
    return 'Para Athletics (Track)';
  }
  
  return 'Para Athletics (Track)';
}

/**
 * Convert training hours per week to training days per week
 * Assumes average 2-3 hours per training day
 */
export function convertTrainingHoursToDays(trainingHours: number): number {
  const avgHoursPerDay = 2.5;
  const days = Math.round(trainingHours / avgHoursPerDay);
  return Math.max(1, Math.min(7, days));
}

/**
 * Predict athlete metrics using the backend API
 */
export async function predictAthlete(data: {
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
  hydrationLevel?: number;
}): Promise<BackendPredictionResponse> {
  const payload: BackendPredictionRequest = {
    age: data.age,
    gender: data.gender,
    disability_type: mapDisabilityType(data.disabilityType),
    sport_type: mapSportType(data.sport),
    weight_kg: data.weightKg,
    height_cm: data.heightCm,
    training_days_per_week: convertTrainingHoursToDays(data.trainingHours),
    sleep_hours: data.sleepHours,
    heart_rate_rest: data.heartRateRest,
    daily_calorie_intake: data.dailyCalorieIntake,
    protein_intake_g: data.proteinIntakeG,
    water_intake_liters: data.waterIntakeLiters,
    hydration_level: data.hydrationLevel || 70,
  };

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(
      typeof error.detail === 'string'
        ? error.detail
        : error.detail.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', ')
    );
  }

  return response.json();
}

/**
 * Chat with Gemini coach
 */
export async function chatWithCoach(
  athleteData: BackendPredictionRequest,
  predictions: BackendPredictionResponse['predictions'],
  userQuestion: string,
  conversationHistory: string = ''
): Promise<CoachChatResponse> {
  const payload: CoachChatRequest = {
    athlete_data: athleteData,
    predictions,
    conversation_history: conversationHistory,
    user_question: userQuestion,
  };

  const response = await fetch(`${API_BASE_URL}/coach/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(
      typeof error.detail === 'string'
        ? error.detail
        : error.detail.map((e) => `${e.loc.join('.')}: ${e.msg}`).join(', ')
    );
  }

  return response.json();
}

/**
 * Check if the API is available
 */
export async function checkApiHealth(): Promise<{ message: string; gemini_enabled: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    if (response.ok) {
      return response.json();
    }
    throw new Error('API not available');
  } catch {
    throw new Error('API not available');
  }
}
