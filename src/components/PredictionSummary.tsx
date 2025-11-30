import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Prediction } from '@/types';
import { Activity, AlertTriangle, Battery } from 'lucide-react';

interface PredictionSummaryProps {
  prediction: Prediction;
  athleteName?: string;
}

export default function PredictionSummary({ prediction, athleteName }: PredictionSummaryProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFatigueColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'High':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStaminaColor = (stamina: number) => {
    if (stamina >= 80) return 'bg-green-500';
    if (stamina >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Convert numeric fatigue level to label
  const getFatigueLabel = (fatigueValue?: number, fatigueLevel?: string): string => {
    if (fatigueLevel) return fatigueLevel;
    if (fatigueValue !== undefined) {
      if (fatigueValue < 0.33) return 'Low';
      if (fatigueValue < 0.66) return 'Medium';
      return 'High';
    }
    return 'Unknown';
  };

  // Get stamina value (handle both percentage and raw number)
  const staminaValue = prediction.staminaLevel ?? prediction.stamina ?? 0;
  const fatigueLabel = getFatigueLabel(prediction.fatigueLevelValue, prediction.fatigueLevel);
  const injuryRisk = prediction.injuryRisk || (prediction.injuryRiskScore !== undefined 
    ? (prediction.injuryRiskScore < 0.33 ? 'Low' : prediction.injuryRiskScore < 0.66 ? 'Moderate' : 'High')
    : 'Unknown');

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Prediction</CardTitle>
        <CardDescription>
          {athleteName ? `AI-powered insights for ${athleteName}` : 'AI-powered performance insights'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stamina */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Stamina Level</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{staminaValue.toFixed(1)}</span>
          </div>
          <Progress value={staminaValue} className="h-3" indicatorClassName={getStaminaColor(staminaValue)} />
          <p className="text-sm text-gray-500">
            {staminaValue >= 80
              ? 'Excellent stamina - ready for high-intensity training'
              : staminaValue >= 60
              ? 'Good stamina - maintain current training load'
              : 'Low stamina - consider reducing training intensity'}
          </p>
        </div>

        {/* Fatigue Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Fatigue Level</span>
            </div>
            <Badge className={getRiskColor(fatigueLabel)}>
              {fatigueLabel}
            </Badge>
          </div>
          <p className={`text-sm font-medium ${getFatigueColor(fatigueLabel)}`}>
            {fatigueLabel === 'Low'
              ? 'Well-rested and ready to perform'
              : fatigueLabel === 'Medium'
              ? 'Moderate fatigue detected - ensure adequate recovery'
              : 'High fatigue - prioritize rest and recovery'}
          </p>
        </div>

        {/* Injury Risk */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium">Injury Risk</span>
            </div>
            <Badge className={getRiskColor(injuryRisk)}>
              {injuryRisk}
            </Badge>
          </div>
          <p className={`text-sm font-medium ${getFatigueColor(injuryRisk)}`}>
            {injuryRisk === 'Low'
              ? 'Low risk - continue with planned training'
              : injuryRisk === 'Moderate' || injuryRisk === 'Medium'
              ? 'Moderate risk - monitor closely and adjust if needed'
              : 'High risk - consider reducing training load'}
          </p>
        </div>

        {/* Last Updated */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Last updated: {new Date(prediction.lastUpdated).toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Note: Predictions are based on training data, sleep patterns, and nutrition scores
          </p>
        </div>
      </CardContent>
    </Card>
  );
}