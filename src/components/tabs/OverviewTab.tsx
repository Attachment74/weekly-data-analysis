import { KPICard } from "@/components/KPICard";
import { Activity, Zap, TrendingUp, Gauge } from "lucide-react";

interface OverviewTabProps {
  kpis: {
    peakDemand: { value: number; change: number; trend: 'up' | 'down' };
    totalGeneration: { value: number; change: number; trend: 'up' | 'down' };
    gridStability: { value: number; status: 'stable' | 'moderate' | 'critical' };
    systemAvailability: { value: number; status: 'stable' | 'moderate' | 'critical' };
  } | null;
}

export const OverviewTab = ({ kpis }: OverviewTabProps) => {
  if (!kpis) {
    return <div className="text-center py-12 text-muted-foreground">No data available</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Ghana Peak Demand"
            value={kpis.peakDemand.value}
            unit="MW"
            change={kpis.peakDemand.change}
            trend={kpis.peakDemand.trend}
            icon={<Zap className="w-5 h-5" />}
          />
          <KPICard
            title="Total Generation"
            value={kpis.totalGeneration.value}
            unit="GWh"
            change={kpis.totalGeneration.change}
            trend={kpis.totalGeneration.trend}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <KPICard
            title="Grid Stability Index"
            value={kpis.gridStability.value.toFixed(1)}
            unit="%"
            status={kpis.gridStability.status}
            icon={<Gauge className="w-5 h-5" />}
          />
          <KPICard
            title="System Availability"
            value={kpis.systemAvailability.value.toFixed(2)}
            unit="%"
            status={kpis.systemAvailability.status}
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      </div>
    </div>
  );
};
