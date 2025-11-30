import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Athlete, Prediction } from '@/types';
import { Activity, Clock, Utensils } from 'lucide-react';

interface AthleteCardProps {
  athlete: Athlete;
  prediction?: Prediction;
}

export default function AthleteCard({ athlete, prediction }: AthleteCardProps) {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {athlete.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{athlete.name}</CardTitle>
              <p className="text-sm text-gray-500">{athlete.sport}</p>
            </div>
          </div>
          {prediction && (
            <Badge className={getRiskColor(prediction.injuryRisk || (prediction.injuryRiskScore !== undefined 
              ? (prediction.injuryRiskScore < 0.33 ? 'Low' : prediction.injuryRiskScore < 0.66 ? 'Moderate' : 'High')
              : 'Unknown') || 'Unknown')}>
              {prediction.injuryRisk || (prediction.injuryRiskScore !== undefined 
                ? (prediction.injuryRiskScore < 0.33 ? 'Low' : prediction.injuryRiskScore < 0.66 ? 'Moderate' : 'High')
                : 'Unknown')} Risk
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Activity className="h-4 w-4" />
              Training
            </span>
            <span className="font-medium">{athlete.trainingHours}h/week</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              Sleep
            </span>
            <span className="font-medium">{athlete.sleepHours}h/night</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <Utensils className="h-4 w-4" />
              Nutrition
            </span>
            <span className="font-medium">
              {athlete.dailyCalorieIntake ? `${athlete.dailyCalorieIntake} cal` : 'N/A'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}