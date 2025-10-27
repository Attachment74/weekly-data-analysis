-- Add RLS policy to allow authenticated users to insert weekly grid data
CREATE POLICY "Authenticated users can insert weekly grid data"
ON public.weekly_grid_data
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Add RLS policy to allow authenticated users to update weekly grid data
CREATE POLICY "Authenticated users can update weekly grid data"
ON public.weekly_grid_data
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);