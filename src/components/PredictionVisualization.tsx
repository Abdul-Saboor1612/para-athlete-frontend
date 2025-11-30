import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Prediction } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts';

interface PredictionVisualizationProps {
  prediction: Prediction;
}

export default function PredictionVisualization({ prediction }: PredictionVisualizationProps) {
  // Get stamina value
  const staminaValue = prediction.staminaLevel ?? prediction.stamina ?? 0;
  
  // Convert fatigue level to a 0-100 scale for visualization
  // Backend returns 0-10, we'll convert to 0-100
  const fatigueValue = prediction.fatigueLevelValue !== undefined 
    ? prediction.fatigueLevelValue * 10 
    : (prediction.fatigueLevel === 'Low' ? 20 : prediction.fatigueLevel === 'Medium' ? 50 : 80);
  
  // Convert injury risk score to percentage
  const injuryRiskValue = prediction.injuryRiskScore !== undefined
    ? prediction.injuryRiskScore * 100
    : (prediction.injuryRisk === 'Low' ? 25 : prediction.injuryRisk === 'Moderate' ? 50 : 75);

  // Data for bar chart
  const barChartData = [
    {
      name: 'Stamina',
      value: staminaValue,
      color: staminaValue >= 80 ? '#10b981' : staminaValue >= 60 ? '#f59e0b' : '#ef4444',
    },
    {
      name: 'Fatigue',
      value: fatigueValue,
      color: fatigueValue <= 30 ? '#10b981' : fatigueValue <= 60 ? '#f59e0b' : '#ef4444',
    },
    {
      name: 'Injury Risk',
      value: injuryRiskValue,
      color: injuryRiskValue <= 33 ? '#10b981' : injuryRiskValue <= 66 ? '#f59e0b' : '#ef4444',
    },
  ];

  // Data for radial chart
  const radialData = [
    {
      name: 'Stamina',
      value: staminaValue,
      fill: staminaValue >= 80 ? '#10b981' : staminaValue >= 60 ? '#f59e0b' : '#ef4444',
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">
            {payload[0].name === 'Stamina' && `${payload[0].value.toFixed(1)}%`}
            {payload[0].name === 'Fatigue' && `${payload[0].value.toFixed(1)}%`}
            {payload[0].name === 'Injury Risk' && `${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics Visualization</CardTitle>
        <CardDescription>
          Visual representation of your performance predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radial Chart for Stamina */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stamina Level</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="90%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={radialData[0].fill}
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-3xl font-bold"
                  fill={radialData[0].fill}
                >
                  {staminaValue.toFixed(0)}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Metric Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg border" style={{ borderColor: barChartData[0].color, backgroundColor: `${barChartData[0].color}10` }}>
            <p className="text-sm text-gray-600 mb-1">Stamina</p>
            <p className="text-2xl font-bold" style={{ color: barChartData[0].color }}>
              {staminaValue.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {staminaValue >= 80 ? 'Excellent' : staminaValue >= 60 ? 'Good' : 'Needs Improvement'}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border" style={{ borderColor: barChartData[1].color, backgroundColor: `${barChartData[1].color}10` }}>
            <p className="text-sm text-gray-600 mb-1">Fatigue</p>
            <p className="text-2xl font-bold" style={{ color: barChartData[1].color }}>
              {fatigueValue.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {fatigueValue <= 30 ? 'Low' : fatigueValue <= 60 ? 'Moderate' : 'High'}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg border" style={{ borderColor: barChartData[2].color, backgroundColor: `${barChartData[2].color}10` }}>
            <p className="text-sm text-gray-600 mb-1">Injury Risk</p>
            <p className="text-2xl font-bold" style={{ color: barChartData[2].color }}>
              {injuryRiskValue.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {injuryRiskValue <= 33 ? 'Low' : injuryRiskValue <= 66 ? 'Moderate' : 'High'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

