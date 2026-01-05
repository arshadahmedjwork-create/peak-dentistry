-- Create oral_health_metrics table
CREATE TABLE public.oral_health_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cavity_risk TEXT NOT NULL CHECK (cavity_risk IN ('low', 'medium', 'high')),
  gum_health TEXT NOT NULL CHECK (gum_health IN ('poor', 'fair', 'good', 'excellent')),
  plaque_level TEXT NOT NULL CHECK (plaque_level IN ('low', 'medium', 'high')),
  assessed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oral_health_metrics ENABLE ROW LEVEL SECURITY;

-- Patients can view their own metrics
CREATE POLICY "Patients can view their own oral health metrics"
ON public.oral_health_metrics
FOR SELECT
USING (auth.uid() = patient_id);

-- Admins can view all metrics
CREATE POLICY "Admins can view all oral health metrics"
ON public.oral_health_metrics
FOR SELECT
USING (is_admin(auth.uid()));

-- Admins can manage all metrics
CREATE POLICY "Admins can manage all oral health metrics"
ON public.oral_health_metrics
FOR ALL
USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER update_oral_health_metrics_updated_at
BEFORE UPDATE ON public.oral_health_metrics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();