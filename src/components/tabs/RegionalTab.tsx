import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { WeeklyData } from "@/lib/excelParser";
import { Badge } from "@/components/ui/badge";

interface RegionalTabProps {
  data: WeeklyData[];
}

export const RegionalTab = ({ data }: RegionalTabProps) => {
  // Group data by station to show regional performance
  const stationPerformance = data.reduce((acc, week) => {
    if (week.worstStation && week.worstFeeder) {
      if (!acc[week.worstStation]) {
        acc[week.worstStation] = {
          station: week.worstStation,
          incidents: 0,
          avgAvailability: 0,
          feeders: new Set<string>()
        };
      }
      acc[week.worstStation].incidents += 1;
      acc[week.worstStation].avgAvailability += week.worstFeederAvailability;
      acc[week.worstStation].feeders.add(week.worstFeeder);
    }
    return acc;
  }, {} as Record<string, { station: string; incidents: number; avgAvailability: number; feeders: Set<string> }>);

  const regionalData = Object.values(stationPerformance).map(station => ({
    ...station,
    avgAvailability: station.avgAvailability / station.incidents,
    feedersAffected: station.feeders.size
  })).sort((a, b) => b.incidents - a.incidents);

  const getStatusBadge = (availability: number) => {
    if (availability >= 95) return <Badge className="bg-success">Excellent</Badge>;
    if (availability >= 90) return <Badge className="bg-warning">Good</Badge>;
    return <Badge className="bg-critical">Needs Attention</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Regional Performance View</h2>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Station Performance Summary</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Station</TableHead>
                  <TableHead className="text-right">Reported Issues</TableHead>
                  <TableHead className="text-right">Feeders Affected</TableHead>
                  <TableHead className="text-right">Avg Availability</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regionalData.map((station) => (
                  <TableRow key={station.station}>
                    <TableCell className="font-medium">{station.station}</TableCell>
                    <TableCell className="text-right">{station.incidents}</TableCell>
                    <TableCell className="text-right">{station.feedersAffected}</TableCell>
                    <TableCell className="text-right">{station.avgAvailability.toFixed(2)}%</TableCell>
                    <TableCell>{getStatusBadge(station.avgAvailability)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Total Stations</h3>
            <p className="text-3xl font-bold">{regionalData.length}</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Most Incidents</h3>
            <p className="text-2xl font-bold">{regionalData[0]?.station || 'N/A'}</p>
            <p className="text-sm text-muted-foreground">{regionalData[0]?.incidents || 0} issues reported</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase mb-2">Best Performance</h3>
            <p className="text-2xl font-bold">
              {regionalData.sort((a, b) => b.avgAvailability - a.avgAvailability)[0]?.station || 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {regionalData[0]?.avgAvailability.toFixed(2) || 0}% availability
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
