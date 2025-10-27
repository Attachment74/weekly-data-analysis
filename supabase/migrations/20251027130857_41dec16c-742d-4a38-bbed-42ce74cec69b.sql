-- Create table to store weekly grid performance data
CREATE TABLE public.weekly_grid_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data JSONB NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_current BOOLEAN NOT NULL DEFAULT false
);

-- Create index for faster queries on current data
CREATE INDEX idx_weekly_grid_data_current ON public.weekly_grid_data(is_current) WHERE is_current = true;

-- Enable RLS (but make data publicly readable since this is operational data)
ALTER TABLE public.weekly_grid_data ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the data
CREATE POLICY "Weekly grid data is publicly readable"
ON public.weekly_grid_data
FOR SELECT
USING (true);

-- Function to set a record as current and unset others
CREATE OR REPLACE FUNCTION public.set_current_weekly_data(data_id UUID)
RETURNS void AS $$
BEGIN
  -- Unset all current flags
  UPDATE public.weekly_grid_data SET is_current = false WHERE is_current = true;
  -- Set the specified record as current
  UPDATE public.weekly_grid_data SET is_current = true WHERE id = data_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically set new uploads as current
CREATE OR REPLACE FUNCTION public.auto_set_current_weekly_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Unset all current flags
  UPDATE public.weekly_grid_data SET is_current = false WHERE is_current = true;
  -- Set this new record as current
  NEW.is_current = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_set_current_weekly_data
BEFORE INSERT ON public.weekly_grid_data
FOR EACH ROW
EXECUTE FUNCTION public.auto_set_current_weekly_data();