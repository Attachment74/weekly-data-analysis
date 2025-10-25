import { Button } from "@/components/ui/button";
import { Upload, Download, Calendar, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  lastUpdated: string;
  onUpload: () => void;
  onExport: () => void;
  onSignOut: () => void;
  isAdmin: boolean;
}

export const DashboardHeader = ({ lastUpdated, onUpload, onExport, onSignOut, isAdmin }: DashboardHeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-6 px-8 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">GRIDCo Performance Dashboard</h1>
            <p className="text-primary-foreground/80 text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Data last updated: {lastUpdated}
            </p>
          </div>
          
          <div className="flex gap-3">
            {isAdmin && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onUpload}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload New Data
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={onSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
