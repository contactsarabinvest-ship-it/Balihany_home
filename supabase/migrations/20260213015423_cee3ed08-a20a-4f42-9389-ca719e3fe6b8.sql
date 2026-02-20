
-- Create designers table
CREATE TABLE public.designers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  name text NOT NULL,
  city_fr text NOT NULL,
  city_en text NOT NULL,
  city_ar text NOT NULL DEFAULT '',
  description_fr text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL DEFAULT '',
  styles_fr text[] NOT NULL DEFAULT '{}',
  styles_en text[] NOT NULL DEFAULT '{}',
  styles_ar text[] NOT NULL DEFAULT '{}',
  budget_level text NOT NULL DEFAULT 'mid-range',
  portfolio_urls text[] NOT NULL DEFAULT '{}',
  logo_url text,
  is_premium boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.designers ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "View approved or own designers"
ON public.designers FOR SELECT
USING (
  (status = 'approved') OR (auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can insert own designer profile"
ON public.designers FOR INSERT
WITH CHECK ((auth.uid() = user_id) AND (status = 'pending'));

CREATE POLICY "Users can update own designer profile"
ON public.designers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any designer"
ON public.designers FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete any designer"
ON public.designers FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create contact_submissions table for lead capture
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text,
  source text NOT NULL DEFAULT 'contact',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only admins can read submissions
CREATE POLICY "Admins can view submissions"
ON public.contact_submissions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert (public contact form)
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions FOR INSERT
WITH CHECK (true);

-- Calculator leads table
CREATE TABLE public.calculator_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  purchase_price numeric,
  nightly_rate numeric,
  occupancy_rate numeric,
  monthly_expenses numeric,
  estimated_monthly_profit numeric,
  estimated_yearly_roi numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view calculator leads"
ON public.calculator_leads FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit calculator lead"
ON public.calculator_leads FOR INSERT
WITH CHECK (true);
