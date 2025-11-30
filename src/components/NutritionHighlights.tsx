import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NutritionRecommendation } from '@/types';
import { mockNutritionRecommendations } from '@/data/mockData';
import { ChevronRight } from 'lucide-react';

export default function NutritionHighlights() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nutrition Recommendations</CardTitle>
        <CardDescription>
          Personalized nutrition guidance for optimal performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockNutritionRecommendations.map((recommendation: NutritionRecommendation) => (
            <div
              key={recommendation.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="text-3xl flex-shrink-0">{recommendation.icon}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {recommendation.title}
                  </h3>
                  <Badge className={getPriorityColor(recommendation.priority)}>
                    {recommendation.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {recommendation.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Pro Tip:</span> These recommendations are based on current training load and recovery metrics. Adjust as needed based on individual response and goals.
          </p>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Consult with a sports nutritionist for personalized meal plans
          </p>
        </div>
      </CardContent>
    </Card>
  );
}