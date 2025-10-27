import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklyData } from "@/lib/excelParser";
import { AlertCircle } from "lucide-react";

interface TransmissionTabProps {
  data: WeeklyData[];
}

export const TransmissionTab = ({ data }: TransmissionTabProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No transmission data available
      </div>
    );
  }

  const availabilityData = data.slice(-12).map(d => ({
    date: d.date.split(',')[0].replace(/\s+/g, ' ').trim(),
    '69kV': d.availability69KV,
    '161kV': d.availability161KV,
    '225kV': d.availability225KV,
    '330kV': d.availability330KV
  }));

  const latestWeek = data[data.length - 1];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Transmission Reliability</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">69kV Availability</h3>
              <div className={`w-3 h-3 rounded-full ${latestWeek.availability69KV >= 99 ? 'bg-success' : 'bg-warning'}`} />
            </div>
            <p className="text-3xl font-bold">{latestWeek.availability69KV.toFixed(2)}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">161kV Availability</h3>
              <div className={`w-3 h-3 rounded-full ${latestWeek.availability161KV >= 99 ? 'bg-success' : 'bg-warning'}`} />
            </div>
            <p className="text-3xl font-bold">{latestWeek.availability161KV.toFixed(2)}%</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground uppercase">225kV Availability</h3>
              <div className={`w-3 h-3 rounded-full ${latestWeek.availability225KV >= 99 ? 'bg-success' : 'bg-warning'}`} />
            </div>
            <p className="text-3xl font-bold">{latestWeek.availability225KV.toFixed(2)}%</p>
          </Card>
        </div>

        <Card className="p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Transmission Line Availability Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={availabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
                domain={[95, 100]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="69kV" stroke="hsl(var(--primary))" strokeWidth={2} />
              <Line type="monotone" dataKey="161kV" stroke="hsl(var(--success))" strokeWidth={2} />
              <Line type="monotone" dataKey="225kV" stroke="hsl(var(--warning))" strokeWidth={2} />
              <Line type="monotone" dataKey="330kV" stroke="hsl(var(--critical))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-warning/10 border-warning">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Worst Performing Feeder</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Station:</span> {latestWeek.worstStation}</p>
                <p><span className="font-medium">Feeder:</span> {latestWeek.worstFeeder}</p>
                <p><span className="font-medium">Availability:</span> {latestWeek.worstFeederAvailability.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
