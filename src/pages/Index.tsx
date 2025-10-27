import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PasswordDialog } from "@/components/PasswordDialog";
import { OverviewTab } from "@/components/tabs/OverviewTab";
import { RecentWeekTab } from "@/components/tabs/RecentWeekTab";
import { GenerationTab } from "@/components/tabs/GenerationTab";
import { TransmissionTab } from "@/components/tabs/TransmissionTab";
import { FrequencyTab } from "@/components/tabs/FrequencyTab";
import { RegionalTab } from "@/components/tabs/RegionalTab";
import { parseExcelFile, calculateKPIs, WeeklyData } from "@/lib/excelParser";
import { exportToPDF } from "@/lib/pdfExport";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [data, setData] = useState<WeeklyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  const loadDataFromDatabase = async () => {
    try {
      setLoading(true);
      const { data: gridData, error } = await supabase
        .from("weekly_grid_data")
        .select("*")
        .eq("is_current", true)
        .maybeSingle();

      if (error) throw error;

      if (gridData) {
        setData(gridData.data as unknown as WeeklyData[]);
        setLastUpdated(new Date(gridData.uploaded_at).toLocaleString());
      } else {
        // No data in database, load initial data
        await loadInitialData();
      }
    } catch (error) {
      console.error("Error loading data from database:", error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load data. Loading initial dataset...",
        variant: "destructive",
      });
      await loadInitialData();
    } finally {
      setLoading(false);
    }
  };

  const loadInitialData = async () => {
    try {
      const response = await fetch('/data/GRIDCo_WEEKLY_New_08_-_2025.xlsx');
      const blob = await response.blob();
      const file = new File([blob], 'GRIDCo_WEEKLY_New_08_-_2025.xlsx');
      const parsedData = await parseExcelFile(file);
      
      // Save to database
      const { error } = await supabase
        .from("weekly_grid_data")
        .insert({
          data: parsedData as any,
        });

      if (error) throw error;

      const timestamp = new Date().toLocaleString();
      setData(parsedData);
      setLastUpdated(timestamp);
      
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
    }
  };

  const handleUpload = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordSuccess = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const parsedData = await parseExcelFile(file);
      
      // Save to database (trigger will automatically set as current)
      const { error } = await supabase
        .from("weekly_grid_data")
        .insert({
          data: parsedData as any,
        });

      if (error) throw error;

      const timestamp = new Date().toLocaleString();
      setData(parsedData);
      setLastUpdated(timestamp);
      
      toast({
        title: "Data Updated Successfully",
        description: `${parsedData.length} weeks of data synced across all devices.`,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error Uploading File",
        description: "Failed to save data to database. Please try again.",
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
    if (!kpis) {
      toast({
        title: "No Data Available",
        description: "Please wait for data to load before exporting.",
        variant: "destructive",
      });
      return;
    }

    try {
      exportToPDF(data, kpis);
      toast({
        title: "Report Exported",
        description: "PDF report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
    }
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
      
      <PasswordDialog 
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={handlePasswordSuccess}
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
