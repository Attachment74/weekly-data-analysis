import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { RecentWeekTab } from "@/components/tabs/RecentWeekTab";
import { GenerationTab } from "@/components/tabs/GenerationTab";
import { TransmissionTab } from "@/components/tabs/TransmissionTab";
import { FrequencyTab } from "@/components/tabs/FrequencyTab";
import { RegionalTab } from "@/components/tabs/RegionalTab";
import { parseExcelFile, calculateKPIs, WeeklyData } from "@/lib/excelParser";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load initial data from public folder
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/GRIDCo_WEEKLY_New_08_-_2025.xlsx');
      const blob = await response.blob();
      const file = new File([blob], 'GRIDCo_WEEKLY_New_08_-_2025.xlsx');
      const parsedData = await parseExcelFile(file);
      setData(parsedData);
      setLastUpdated(new Date().toLocaleString());
      
      toast({
        title: "Data Loaded Successfully",
        description: `${parsedData.length} weeks of data loaded.`,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load the initial dataset.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const parsedData = await parseExcelFile(file);
      setData(parsedData);
      setLastUpdated(new Date().toLocaleString());
      
      toast({
        title: "Data Updated Successfully",
        description: `${parsedData.length} weeks of data loaded from ${file.name}.`,
      });
    } catch (error) {
      console.error('Error parsing file:', error);
      toast({
        title: "Error Parsing File",
        description: "Please ensure the file format matches the expected structure.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Feature",
      description: "Export functionality will be available soon.",
    });
  };

  const kpis = data.length > 0 ? calculateKPIs(data) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading GRIDCo Performance Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <DashboardHeader
        lastUpdated={lastUpdated}
        onUpload={handleUpload}
        onExport={handleExport}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
      />

      <main className="max-w-7xl mx-auto px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recent">Recent Week</TabsTrigger>
            <TabsTrigger value="generation">Generation</TabsTrigger>
            <TabsTrigger value="transmission">Transmission</TabsTrigger>
            <TabsTrigger value="frequency">Frequency</TabsTrigger>
            <TabsTrigger value="regional">Regional</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab kpis={kpis} />
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <RecentWeekTab latestWeek={data[data.length - 1] || null} />
          </TabsContent>

          <TabsContent value="generation" className="space-y-4">
            <GenerationTab data={data} />
          </TabsContent>

          <TabsContent value="transmission" className="space-y-4">
            <TransmissionTab data={data} />
          </TabsContent>

          <TabsContent value="frequency" className="space-y-4">
            <FrequencyTab data={data} />
          </TabsContent>

          <TabsContent value="regional" className="space-y-4">
            <RegionalTab data={data} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-primary/5 border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 PURC - ESPM Analytics Portal | GRIDCo Weekly Performance Dashboard</p>
          <p className="mt-1">Developed for regulation-grade performance monitoring</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
