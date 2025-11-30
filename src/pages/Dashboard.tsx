import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Activity } from 'lucide-react';
import AthleteForm from '@/components/AthleteForm';
import PerformanceDial from '@/components/PerformanceDial';
import TrendAnalysis from '@/components/TrendAnalysis';
import RiskAssessment from '@/components/RiskAssessment';
import AIRecommendation from '@/components/AIRecommendation';
import { predictAthlete, BackendPredictionResponse } from '@/lib/api';
import { Prediction } from '@/types';
import { convertBackendPredictionToFrontend } from '@/lib/predictionUtils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [predictionResult, setPredictionResult] = useState<BackendPredictionResponse | null>(null);
  const [frontendPrediction, setFrontendPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePredictionSuccess = (result: BackendPredictionResponse) => {
    setPredictionResult(result);
    const frontendPred = convertBackendPredictionToFrontend(result, 'current');
    setFrontendPrediction(frontendPred);
    setError(null);
  };

  const handleStartChat = () => {
    if (predictionResult) {
      sessionStorage.setItem('athleteData', JSON.stringify(predictionResult.input));
      sessionStorage.setItem('predictions', JSON.stringify(predictionResult.predictions));
      navigate('/chat');
    }
  };

  // Generate trend data (7 days) based on current predictions
  const generateTrendData = () => {
    if (!frontendPrediction) return [];
    
    const stamina = frontendPrediction.staminaLevel ?? frontendPrediction.stamina ?? 0;
    const fatigue = frontendPrediction.fatigueLevelValue ?? 0;
    const injuryRisk = frontendPrediction.injuryRiskScore ?? 0;
    
    // Generate realistic trend data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      // Add some variation to make it realistic
      const variation = (Math.random() - 0.5) * 20;
      return {
        day,
        trainingIntensity: Math.max(0, Math.min(100, stamina + variation)),
        recoveryScore: Math.max(0, Math.min(100, 100 - (fatigue * 10) + variation)),
        sleepQuality: Math.max(0, Math.min(100, 70 + variation)),
        stressLevel: Math.max(0, Math.min(100, (injuryRisk * 100) + variation)),
      };
    });
  };

  // Generate risk factors based on predictions
  const generateRiskFactors = () => {
    if (!frontendPrediction) return [];
    
    const factors = [];
    const fatigue = frontendPrediction.fatigueLevelValue ?? 0;
    const injuryRisk = frontendPrediction.injuryRiskScore ?? 0;
    
    if (fatigue > 0.5) {
      factors.push({
        type: 'High Fatigue',
        description: 'e.g., Elevated resting heart rate',
        icon: 'fatigue' as const,
      });
    }
    
    if (injuryRisk > 0.5) {
      factors.push({
        type: 'Recent Injury History',
        description: 'e.g., Monitor training load closely',
        icon: 'injury' as const,
      });
    }
    
    // Always add hydration as it's in the form data
    factors.push({
      type: 'Hydration Monitoring',
      description: 'e.g., Ensure optimal fluid intake',
      icon: 'hydration' as const,
    });
    
    return factors;
  };

  // Generate AI recommendations
  const generateRecommendations = () => {
    if (!predictionResult || !frontendPrediction) return [];
    
    const recommendations = [];
    const stamina = frontendPrediction.staminaLevel ?? frontendPrediction.stamina ?? 0;
    const fatigue = frontendPrediction.fatigueLevelValue ?? 0;
    const dailyCalories = predictionResult.input.daily_calorie_intake;
    
    // Nutrition recommendation
    if (stamina < 70) {
      recommendations.push({
        type: 'nutrition' as const,
        title: 'Nutrition Adjustment',
        description: `Increase carbohydrate intake by 10% for next two days. Focus on whole grains and lean proteins post-training. Current intake: ${dailyCalories} kcal/day.`,
        actionLabel: 'View Meal Plan',
      });
    }
    
    // Hydration recommendation
    recommendations.push({
      type: 'hydration' as const,
      title: 'Hydration Strategy',
      description: 'Ensure regular water intake throughout the day. Consume an electrolyte drink during and after intense training sessions.',
      actionLabel: 'Track Intake',
    });
    
    // Training recommendation
    if (fatigue > 0.5 || (frontendPrediction.injuryRiskScore ?? 0) > 0.5) {
      recommendations.push({
        type: 'training' as const,
        title: 'Training Adjustment',
        description: 'Reduce intensity of tomorrow\'s session by 20%. Focus on active recovery and stretching exercises.',
        actionLabel: 'Update Plan',
      });
    }
    
    return recommendations;
  };

  // Calculate readiness score (inverse of injury risk, adjusted by stamina)
  const calculateReadinessScore = () => {
    if (!frontendPrediction) return 0;
    const stamina = frontendPrediction.staminaLevel ?? frontendPrediction.stamina ?? 0;
    const injuryRisk = frontendPrediction.injuryRiskScore ?? 0;
    return Math.round((stamina * 0.6) + ((1 - injuryRisk) * 100 * 0.4));
  };

  const getStaminaStatus = (value: number) => {
    if (value >= 80) return 'Optimal';
    if (value >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getRecoveryStatus = (fatigue: number) => {
    const recovery = 100 - (fatigue * 10);
    if (recovery >= 80) return 'Excellent';
    if (recovery >= 60) return 'Good';
    return 'Needs Improvement';
  };

  const getHydrationStatus = () => {
    // This would come from actual hydration data, for now use a placeholder
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-400 ml-4">dashboard.para-athlete-monitor.ai</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
            Web View
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white">
            Responsive
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PARA ATHLETE MONITOR</h1>
              <div className="flex gap-4 mt-2">
                <span className="text-sm text-blue-400 font-semibold border-b-2 border-blue-400 pb-1">
                  Dashboard
                </span>
                <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Athletes</span>
                <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Training</span>
                <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Health</span>
                <span className="text-sm text-gray-400 hover:text-white cursor-pointer">Reports</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">
              {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}, {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert className="bg-red-500/20 border-red-500/30">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Form and Metrics */}
          <div className="space-y-6">
            <AthleteForm
              onSuccess={handlePredictionSuccess}
              onError={setError}
              loading={loading}
              setLoading={setLoading}
            />

            {!loading && frontendPrediction && (
              <>
                <div>
                  <h3 className="text-white text-sm font-semibold mb-4">ATHLETE METRICS</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <PerformanceDial
                      label="TRAINING LOAD"
                      value={Math.round(frontendPrediction.staminaLevel ?? frontendPrediction.stamina ?? 0)}
                      maxValue={100}
                      status={getStaminaStatus(frontendPrediction.staminaLevel ?? frontendPrediction.stamina ?? 0)}
                      color="blue"
                      trend="up"
                    />
                    <PerformanceDial
                      label="RECOVERY"
                      value={Math.round(100 - ((frontendPrediction.fatigueLevelValue ?? 0) * 10))}
                      maxValue={100}
                      status={getRecoveryStatus(frontendPrediction.fatigueLevelValue ?? 0)}
                      color="green"
                      trend="up"
                    />
                    <PerformanceDial
                      label="HYDRATION"
                      value={68}
                      maxValue={100}
                      status={getHydrationStatus()}
                      color="orange"
                      trend="down"
                    />
                  </div>
                </div>
              </>
            )}

            {loading && (
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-300">Analyzing performance data...</span>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Middle Column: Trends and Recommendations */}
          <div className="space-y-6">
            {!loading && frontendPrediction && (
              <>
                <TrendAnalysis data={generateTrendData()} />
                <AIRecommendation recommendations={generateRecommendations()} />
              </>
            )}
          </div>

          {/* Right Column: Risk Assessment */}
          <div>
            {!loading && frontendPrediction && (
              <div className="space-y-6">
                <RiskAssessment
                  riskLevel={frontendPrediction.injuryRisk === 'High' ? 'High' : frontendPrediction.injuryRisk === 'Moderate' ? 'Moderate' : 'Low'}
                  riskScore={calculateReadinessScore()}
                  riskFactors={generateRiskFactors()}
                />
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6">
                    <Button
                      onClick={handleStartChat}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      size="lg"
                    >
                      Chat with AI Coach
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
