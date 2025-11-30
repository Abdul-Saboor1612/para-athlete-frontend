/**
 * Utility functions for converting backend predictions to frontend format
 */

import { Prediction } from '@/types';
import { BackendPredictionResponse } from './api';

/**
 * Convert backend prediction response to frontend Prediction format
 */
export function convertBackendPredictionToFrontend(
  backendResponse: BackendPredictionResponse,
  athleteId: string
): Prediction {
  const predictions = backendResponse.predictions;
  
  // Convert numeric fatigue level to label
  let fatigueLabel: 'Low' | 'Medium' | 'High' = 'Medium';
  if (predictions.fatigue_level < 0.33) {
    fatigueLabel = 'Low';
  } else if (predictions.fatigue_level < 0.66) {
    fatigueLabel = 'Medium';
  } else {
    fatigueLabel = 'High';
  }

  return {
    athleteId,
    stamina: predictions.stamina_level,
    staminaLevel: predictions.stamina_level,
    fatigueLevel: fatigueLabel,
    fatigueLevelValue: predictions.fatigue_level,
    injuryRisk: predictions.injury_risk_label === 'Moderate' ? 'Moderate' : predictions.injury_risk_label,
    injuryRiskScore: predictions.injury_risk_score,
    lastUpdated: new Date(),
  };
}

