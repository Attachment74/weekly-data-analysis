import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const PasswordDialog = ({ open, onOpenChange, onSuccess }: PasswordDialogProps) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error: funcError } = await supabase.functions.invoke('verify-upload-password', {
        body: { password }
      });

      if (funcError) throw funcError;

      if (data?.verified) {
        onSuccess();
        onOpenChange(false);
        setPassword("");
      } else {
        setError("Incorrect password");
      }
    } catch (err) {
      console.error('Password verification error:', err);
      setError("Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Authorization Required</DialogTitle>
          <DialogDescription>
            Enter the upload password to proceed with data upload
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
