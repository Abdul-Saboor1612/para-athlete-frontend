import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Droplet, Dumbbell } from 'lucide-react';

interface Recommendation {
  type: 'nutrition' | 'hydration' | 'training';
  title: string;
  description: string;
  actionLabel: string;
}

interface AIRecommendationProps {
  recommendations: Recommendation[];
}

export default function AIRecommendation({ recommendations }: AIRecommendationProps) {
  const iconMap = {
    nutrition: Utensils,
    hydration: Droplet,
    training: Dumbbell,
  };

  const colorMap = {
    nutrition: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
    hydration: 'bg-green-500/20 border-green-500/30 text-green-400',
    training: 'bg-orange-500/20 border-orange-500/30 text-orange-400',
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <h3 className="text-white text-sm font-semibold mb-4">RECOMMENDATIONS & ACTIONS</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => {
            const IconComponent = iconMap[rec.type];
            const colors = colorMap[rec.type];
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${colors} bg-slate-700/30`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colors.replace('text-', 'bg-').replace('border-', '')}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white mb-2">{rec.description}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 text-xs"
                    >
                      {rec.actionLabel}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

