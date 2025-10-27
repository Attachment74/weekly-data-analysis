-- Fix search_path for security functions
CREATE OR REPLACE FUNCTION public.set_current_weekly_data(data_id UUID)
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Unset all current flags
  UPDATE public.weekly_grid_data SET is_current = false WHERE is_current = true;
  -- Set the specified record as current
  UPDATE public.weekly_grid_data SET is_current = true WHERE id = data_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_set_current_weekly_data()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Unset all current flags
  UPDATE public.weekly_grid_data SET is_current = false WHERE is_current = true;
  -- Set this new record as current
  NEW.is_current = true;
  RETURN NEW;
END;
$$;