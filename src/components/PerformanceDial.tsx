import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceDialProps {
  label: string;
  value: number;
  maxValue: number;
  status: string;
  color: 'blue' | 'green' | 'orange';
  trend?: 'up' | 'down';
}

export default function PerformanceDial({
  label,
  value,
  maxValue,
  status,
  color,
  trend,
}: PerformanceDialProps) {
  const percentage = (value / maxValue) * 100;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    blue: {
      stroke: 'stroke-blue-500',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
    },
    green: {
      stroke: 'stroke-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-400',
    },
    orange: {
      stroke: 'stroke-orange-500',
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-slate-700"
              />
              <circle
                cx="64"
                cy="64"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={colors.stroke}
                style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${colors.text}`}>{value}</span>
              <span className="text-xs text-gray-400 mt-1">{value}/{maxValue}</span>
            </div>
            {trend && (
              <div className="absolute top-0 right-0">
                {trend === 'up' ? (
                  <TrendingUp className={`h-4 w-4 ${colors.text}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 ${colors.text}`} />
                )}
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-sm font-semibold ${colors.text}`}>{status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

