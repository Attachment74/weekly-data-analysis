import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'stable' | 'moderate' | 'critical';
  icon?: React.ReactNode;
}

export const KPICard = ({ title, value, unit, change, trend, status, icon }: KPICardProps) => {
  const getStatusColor = () => {
    if (!status) return '';
    switch (status) {
      case 'stable': return 'text-success';
      case 'moderate': return 'text-warning';
      case 'critical': return 'text-critical';
      default: return '';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-critical" />;
    return null;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", getStatusColor())}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center gap-1 text-sm">
            {getTrendIcon()}
            <span className={cn(
              "font-medium",
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-critical' : 'text-muted-foreground'
            )}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </div>
    </Card>
  );
};
