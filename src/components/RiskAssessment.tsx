import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Activity, Droplet, Bandage } from 'lucide-react';

interface RiskFactor {
  type: string;
  description: string;
  icon: 'fatigue' | 'hydration' | 'injury';
}

interface RiskAssessmentProps {
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskScore: number;
  riskFactors: RiskFactor[];
}

export default function RiskAssessment({ riskLevel, riskScore, riskFactors }: RiskAssessmentProps) {
  const riskColors = {
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    Moderate: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const iconMap = {
    fatigue: Activity,
    hydration: Droplet,
    injury: Bandage,
  };

  const getReadinessLabel = (score: number) => {
    if (score >= 80) return 'EXCELLENT';
    if (score >= 60) return 'GOOD';
    if (score >= 40) return 'CAUTION';
    return 'LOW';
  };

  const getReadinessColor = (score: number) => {
    if (score >= 80) return { text: 'text-green-400 bg-green-500/20', bar: 'bg-green-500' };
    if (score >= 60) return { text: 'text-yellow-400 bg-yellow-500/20', bar: 'bg-yellow-500' };
    if (score >= 40) return { text: 'text-orange-400 bg-orange-500/20', bar: 'bg-orange-500' };
    return { text: 'text-red-400 bg-red-500/20', bar: 'bg-red-500' };
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm font-semibold">RISK ASSESSMENT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Badge */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${riskColors[riskLevel]}`}>
          <AlertTriangle className="h-5 w-5" />
          <span className="font-semibold text-sm">{riskLevel.toUpperCase()} RISK</span>
        </div>

        {/* Risk Factors */}
        {riskFactors.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-semibold">RISK FACTORS:</p>
            {riskFactors.map((factor, index) => {
              const IconComponent = iconMap[factor.icon];
              const iconColors = {
                fatigue: 'text-red-400',
                hydration: 'text-blue-400',
                injury: 'text-red-400',
              };
              return (
                <div key={index} className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg">
                  <IconComponent className={`h-5 w-5 ${iconColors[factor.icon]} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className="text-sm text-white font-medium">{factor.type}</p>
                    <p className="text-xs text-gray-400 mt-1">{factor.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Readiness Score */}
        <div className="pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-semibold">READINESS SCORE</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${getReadinessColor(riskScore).text}`}>
              {getReadinessLabel(riskScore)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${getReadinessColor(riskScore).bar}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>
            <span className="text-sm text-white font-semibold min-w-[3rem] text-right">{riskScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

