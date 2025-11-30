import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  day: string;
  trainingIntensity: number;
  recoveryScore: number;
  sleepQuality: number;
  stressLevel: number;
}

interface TrendAnalysisProps {
  data: TrendData[];
}

export default function TrendAnalysis({ data }: TrendAnalysisProps) {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-sm font-semibold">7-DAY TREND ANALYSIS</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="day" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'SCORE', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF', fontSize: '12px' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F3F4F6',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
            />
            <Line 
              type="monotone" 
              dataKey="trainingIntensity" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              name="Training Intensity"
            />
            <Line 
              type="monotone" 
              dataKey="recoveryScore" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 4 }}
              name="Recovery Score"
            />
            <Line 
              type="monotone" 
              dataKey="sleepQuality" 
              stroke="#A855F7" 
              strokeWidth={2}
              dot={{ fill: '#A855F7', r: 4 }}
              name="Sleep Quality"
            />
            <Line 
              type="monotone" 
              dataKey="stressLevel" 
              stroke="#F59E0B" 
              strokeWidth={2}
              dot={{ fill: '#F59E0B', r: 4 }}
              name="Stress Level"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

