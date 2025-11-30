import { Athlete, Prediction, Message, NutritionRecommendation } from '@/types';

export const mockAthletes: Athlete[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    disabilityType: 'Lower Limb Amputation',
    sport: 'Para Athletics - Sprint',
    trainingHours: 25,
    sleepHours: 7.5,
    weightKg: 65,
    heightCm: 165,
    heartRateRest: 58,
    dailyCalorieIntake: 2400,
    proteinIntakeG: 120,
    waterIntakeLiters: 2.8,
    hydrationLevel: 80,
    avatar: 'SJ'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 32,
    gender: 'Male',
    disabilityType: 'Visual Impairment',
    sport: 'Para Swimming',
    trainingHours: 30,
    sleepHours: 8,
    weightKg: 75,
    heightCm: 178,
    heartRateRest: 55,
    dailyCalorieIntake: 2800,
    proteinIntakeG: 150,
    waterIntakeLiters: 3.2,
    hydrationLevel: 85,
    avatar: 'MC'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 24,
    gender: 'Female',
    disabilityType: 'Cerebral Palsy',
    sport: 'Wheelchair Basketball',
    trainingHours: 20,
    sleepHours: 7,
    weightKg: 60,
    heightCm: 160,
    heartRateRest: 62,
    dailyCalorieIntake: 2200,
    proteinIntakeG: 110,
    waterIntakeLiters: 2.5,
    hydrationLevel: 75,
    avatar: 'ER'
  },
  {
    id: '4',
    name: 'James Wilson',
    age: 29,
    gender: 'Male',
    disabilityType: 'Spinal Cord Injury',
    sport: 'Wheelchair Racing',
    trainingHours: 28,
    sleepHours: 6.5,
    weightKg: 70,
    heightCm: 175,
    heartRateRest: 60,
    dailyCalorieIntake: 2600,
    proteinIntakeG: 130,
    waterIntakeLiters: 3.0,
    hydrationLevel: 78,
    avatar: 'JW'
  }
];

export const mockPredictions: Record<string, Prediction> = {
  '1': {
    athleteId: '1',
    stamina: 85,
    staminaLevel: 85,
    fatigueLevel: 'Low',
    fatigueLevelValue: 0.25,
    injuryRisk: 'Low',
    injuryRiskScore: 0.28,
    lastUpdated: new Date()
  },
  '2': {
    athleteId: '2',
    stamina: 92,
    staminaLevel: 92,
    fatigueLevel: 'Low',
    fatigueLevelValue: 0.20,
    injuryRisk: 'Low',
    injuryRiskScore: 0.22,
    lastUpdated: new Date()
  },
  '3': {
    athleteId: '3',
    stamina: 72,
    staminaLevel: 72,
    fatigueLevel: 'Medium',
    fatigueLevelValue: 0.55,
    injuryRisk: 'Moderate',
    injuryRiskScore: 0.58,
    lastUpdated: new Date()
  },
  '4': {
    athleteId: '4',
    stamina: 78,
    staminaLevel: 78,
    fatigueLevel: 'Medium',
    fatigueLevelValue: 0.48,
    injuryRisk: 'Low',
    injuryRiskScore: 0.35,
    lastUpdated: new Date()
  }
};

export const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'coach',
    content: 'Good morning! How are you feeling after yesterday\'s training session?',
    timestamp: new Date(Date.now() - 3600000 * 24)
  },
  {
    id: '2',
    sender: 'athlete',
    content: 'Hi Coach! I\'m feeling good, a bit sore in my shoulders but nothing unusual.',
    timestamp: new Date(Date.now() - 3600000 * 23)
  },
  {
    id: '3',
    sender: 'coach',
    content: 'That\'s normal after the intensity work we did. Make sure you\'re doing your recovery stretches and staying hydrated.',
    timestamp: new Date(Date.now() - 3600000 * 22)
  },
  {
    id: '4',
    sender: 'athlete',
    content: 'Will do! Should I adjust my nutrition plan for the upcoming competition?',
    timestamp: new Date(Date.now() - 3600000 * 21)
  },
  {
    id: '5',
    sender: 'coach',
    content: 'Yes, let\'s increase your carb intake starting 3 days before. I\'ll send you the updated meal plan.',
    timestamp: new Date(Date.now() - 3600000 * 20)
  },
  {
    id: '6',
    sender: 'athlete',
    content: 'Perfect, thank you! Looking forward to it.',
    timestamp: new Date(Date.now() - 3600000 * 19)
  },
  {
    id: '7',
    sender: 'coach',
    content: 'Your stamina metrics are looking excellent. Keep up the great work!',
    timestamp: new Date(Date.now() - 3600000 * 2)
  },
  {
    id: '8',
    sender: 'athlete',
    content: 'Thanks Coach! I can really feel the improvement.',
    timestamp: new Date(Date.now() - 3600000 * 1)
  }
];

export const mockNutritionRecommendations: NutritionRecommendation[] = [
  {
    id: '1',
    title: 'Hydration',
    description: 'Drink at least 3 liters of water daily, especially before and after training sessions',
    priority: 'high',
    icon: '💧'
  },
  {
    id: '2',
    title: 'Protein Intake',
    description: 'Consume 1.6-2.0g of protein per kg body weight to support muscle recovery',
    priority: 'high',
    icon: '🥩'
  },
  {
    id: '3',
    title: 'Complex Carbohydrates',
    description: 'Include whole grains, sweet potatoes, and oats for sustained energy',
    priority: 'medium',
    icon: '🌾'
  },
  {
    id: '4',
    title: 'Recovery Meals',
    description: 'Eat within 30 minutes post-training: protein + carbs combination',
    priority: 'high',
    icon: '🍽️'
  },
  {
    id: '5',
    title: 'Omega-3 Fatty Acids',
    description: 'Include fish, nuts, and seeds to reduce inflammation',
    priority: 'medium',
    icon: '🐟'
  },
  {
    id: '6',
    title: 'Vitamin D & Calcium',
    description: 'Essential for bone health - consider supplementation if needed',
    priority: 'medium',
    icon: '☀️'
  }
];