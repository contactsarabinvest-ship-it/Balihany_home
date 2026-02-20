
-- Add Arabic fields to concierge_companies
ALTER TABLE public.concierge_companies
  ADD COLUMN city_ar text NOT NULL DEFAULT '',
  ADD COLUMN description_ar text NOT NULL DEFAULT '',
  ADD COLUMN services_ar text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN cities_covered_ar text[] NOT NULL DEFAULT '{}'::text[],
  ADD COLUMN status text NOT NULL DEFAULT 'approved',
  ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- User roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'concierge', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Update concierge RLS: allow concierge users to insert their own pending companies
CREATE POLICY "Concierge users can insert own company"
  ON public.concierge_companies FOR INSERT
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Concierge users can update their own company
CREATE POLICY "Concierge users can update own company"
  ON public.concierge_companies FOR UPDATE
  USING (auth.uid() = user_id);

-- Update the select policy to only show approved companies to public, but own companies to the owner
DROP POLICY "Anyone can view concierge companies" ON public.concierge_companies;
CREATE POLICY "View approved or own companies"
  ON public.concierge_companies FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Admins can update any company (for approval)
CREATE POLICY "Admins can update any company"
  ON public.concierge_companies FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete any company
CREATE POLICY "Admins can delete any company"
  ON public.concierge_companies FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));
