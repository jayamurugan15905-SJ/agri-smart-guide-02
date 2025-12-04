import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoistureChartProps {
  data: number[];
  threshold: number;
  prediction: {
    predictedMoisture: number;
    needsIrrigation: boolean;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
}

export const MoistureChart = ({ data, threshold, prediction }: MoistureChartProps) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartData = data.map((value, index) => ({
    day: days[index],
    moisture: value,
  }));

  // Add prediction
  chartData.push({
    day: 'Tomorrow',
    moisture: prediction.predictedMoisture,
  });

  const TrendIcon = prediction.trend === 'increasing' 
    ? TrendingUp 
    : prediction.trend === 'decreasing' 
      ? TrendingDown 
      : Minus;

  return (
    <div className="rounded-xl border-2 border-border bg-card overflow-hidden shadow-card">
      {/* Header */}
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">
              Moisture Trend & Prediction
            </h3>
            <p className="text-sm text-muted-foreground">
              7-day history with tomorrow's forecast
            </p>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
            prediction.trend === 'increasing' && "bg-success/20 text-success",
            prediction.trend === 'decreasing' && "bg-warning/20 text-warning",
            prediction.trend === 'stable' && "bg-accent/20 text-accent",
          )}>
            <TrendIcon className="w-4 h-4" />
            {prediction.trend.charAt(0).toUpperCase() + prediction.trend.slice(1)}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="hsl(195, 70%, 45%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 20%, 85%)" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fill: 'hsl(150, 15%, 45%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(150, 20%, 85%)' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fill: 'hsl(150, 15%, 45%)', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(150, 20%, 85%)' }}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(85, 30%, 98%)',
                  border: '2px solid hsl(150, 20%, 85%)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ color: 'hsl(150, 30%, 15%)', fontWeight: 600 }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Moisture']}
              />
              <ReferenceLine 
                y={threshold} 
                stroke="hsl(38, 92%, 50%)" 
                strokeDasharray="5 5"
                label={{ 
                  value: `Threshold: ${threshold}%`, 
                  position: 'right',
                  fill: 'hsl(38, 92%, 50%)',
                  fontSize: 11,
                }}
              />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="hsl(195, 70%, 45%)"
                strokeWidth={3}
                fill="url(#moistureGradient)"
                dot={{ fill: 'hsl(195, 70%, 45%)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(195, 70%, 45%)', stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Prediction Summary */}
        <div className={cn(
          "mt-4 p-4 rounded-lg border",
          prediction.needsIrrigation 
            ? "bg-warning/10 border-warning/30" 
            : "bg-success/10 border-success/30"
        )}>
          <p className="text-sm">
            <span className="font-semibold text-foreground">Tomorrow's Forecast: </span>
            <span className="text-muted-foreground">
              Predicted moisture at {prediction.predictedMoisture.toFixed(1)}%.
              {prediction.needsIrrigation 
                ? " Irrigation will be needed." 
                : " No irrigation required."}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
