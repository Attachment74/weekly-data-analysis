import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeeklyData } from "@/lib/excelParser";
import { Calendar, Zap, TrendingUp, Gauge, Activity, AlertCircle } from "lucide-react";

interface RecentWeekTabProps {
  latestWeek: WeeklyData | null;
}

export const RecentWeekTab = ({ latestWeek }: RecentWeekTabProps) => {
  if (!latestWeek) {
    return <div className="text-center py-12 text-muted-foreground">No data available</div>;
  }

  const getStatusBadge = (value: number, threshold: number) => {
    if (value >= threshold) return <Badge className="bg-success">Stable</Badge>;
    if (value >= threshold - 10) return <Badge className="bg-warning">Moderate</Badge>;
    return <Badge className="bg-destructive">Critical</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Latest Week Performance</h2>
          <p className="text-muted-foreground">Week ending: {latestWeek.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Generation & Demand */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Generation & Demand</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Energy Generated</p>
              <p className="text-2xl font-bold">{latestWeek.totalEnergyGenerated.toFixed(2)} GWh</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ghana Peak Demand</p>
              <p className="text-xl font-semibold">{latestWeek.maxGhanaDemand.toFixed(2)} MW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Domestic Peak Demand</p>
              <p className="text-xl font-semibold">{latestWeek.maxDomesticDemand.toFixed(2)} MW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Demand</p>
              <p className="text-xl font-semibold">{latestWeek.averageDemand.toFixed(2)} MW</p>
            </div>
          </CardContent>
        </Card>

        {/* Load Factor */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Load Factor</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-5xl font-bold text-primary">{latestWeek.loadFactor.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground mt-2">System efficiency indicator</p>
            </div>
          </CardContent>
        </Card>

        {/* Frequency Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Frequency Stability</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Within Range</p>
              {getStatusBadge(latestWeek.frequencyWithinRange, 80)}
            </div>
            <p className="text-3xl font-bold text-success">{latestWeek.frequencyWithinRange.toFixed(2)}%</p>
            <div>
              <p className="text-sm text-muted-foreground">Outside Range</p>
              <p className="text-xl font-semibold text-destructive">{latestWeek.frequencyOutsideRange.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Benchmark</p>
              <p className="text-lg">{latestWeek.frequencyBenchmark.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Transmission Availability */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Transmission Line Availability</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">69 kV</p>
                <p className="text-2xl font-bold">{latestWeek.availability69KV.toFixed(2)}%</p>
                {getStatusBadge(latestWeek.availability69KV, 99)}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">161 kV</p>
                <p className="text-2xl font-bold">{latestWeek.availability161KV.toFixed(2)}%</p>
                {getStatusBadge(latestWeek.availability161KV, 99)}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">225 kV</p>
                <p className="text-2xl font-bold">{latestWeek.availability225KV.toFixed(2)}%</p>
                {getStatusBadge(latestWeek.availability225KV, 99)}
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">330 kV</p>
                <p className="text-2xl font-bold">{latestWeek.availability330KV.toFixed(2)}%</p>
                {getStatusBadge(latestWeek.availability330KV, 99)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribution Company Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Distribution Performance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-semibold mb-2">ECG Availability</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Including Planned</span>
                  <span className="font-semibold">{latestWeek.ecgAvailabilityIncludingPlanned.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Excluding Planned</span>
                  <span className="font-semibold">{latestWeek.ecgAvailabilityExcludingPlanned.toFixed(2)}%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-2">NEDCo Availability</p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Including Planned</span>
                  <span className="font-semibold">{latestWeek.nedcoAvailabilityIncludingPlanned.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Excluding Planned</span>
                  <span className="font-semibold">{latestWeek.nedcoAvailabilityExcludingPlanned.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worst Performers */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Critical Issues - Week {latestWeek.date}</CardTitle>
            <CardDescription>Stations and feeders requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                <p className="text-sm text-muted-foreground mb-1">Worst Performing Station</p>
                <p className="text-lg font-bold text-destructive">{latestWeek.worstStation || "N/A"}</p>
              </div>
              <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                <p className="text-sm text-muted-foreground mb-1">Worst Performing Feeder</p>
                <p className="text-lg font-bold text-destructive">{latestWeek.worstFeeder || "N/A"}</p>
              </div>
              <div className="p-4 border border-destructive rounded-lg bg-destructive/5">
                <p className="text-sm text-muted-foreground mb-1">Feeder Availability</p>
                <p className="text-lg font-bold text-destructive">{latestWeek.worstFeederAvailability.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
