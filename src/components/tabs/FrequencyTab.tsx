import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { WeeklyData } from "@/lib/excelParser";

interface FrequencyTabProps {
  data: WeeklyData[];
}

export const FrequencyTab = ({ data }: FrequencyTabProps) => {
  const frequencyData = data.slice(-12).map(d => ({
    date: d.date.split(',')[0].replace(/\s+/g, ' ').trim(),
    withinRange: d.frequencyWithinRange,
    outsideRange: d.frequencyOutsideRange,
    benchmark: d.frequencyBenchmark
  }));

  const latestWeek = data[data.length - 1];
  const avgWithinRange = data.reduce((sum, d) => sum + d.frequencyWithinRange, 0) / data.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Frequency Deviation Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 bg-success/10 border-success">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Within Range</h3>
            <p className="text-3xl font-bold text-success">{latestWeek.frequencyWithinRange.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Current Week</p>
          </Card>

          <Card className="p-6 bg-critical/10 border-critical">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Outside Range</h3>
            <p className="text-3xl font-bold text-critical">{latestWeek.frequencyOutsideRange.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Current Week</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Average (All Weeks)</h3>
            <p className="text-3xl font-bold">{avgWithinRange.toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Within Range</p>
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Frequency Deviation Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="withinRange" 
                fill="hsl(var(--success))" 
                name="Within Range (%)"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="outsideRange" 
                fill="hsl(var(--critical))" 
                name="Outside Range (%)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Benchmark Target</p>
              <p className="text-2xl font-bold">{latestWeek.frequencyBenchmark}%</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Current Performance</p>
              <p className={`text-2xl font-bold ${latestWeek.frequencyWithinRange >= latestWeek.frequencyBenchmark ? 'text-critical' : 'text-success'}`}>
                {latestWeek.frequencyWithinRange >= latestWeek.frequencyBenchmark ? 'Below Target' : 'Above Target'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
