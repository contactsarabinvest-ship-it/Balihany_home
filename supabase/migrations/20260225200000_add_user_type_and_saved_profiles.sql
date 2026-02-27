-- Add user_type to profiles (investor or professional)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_type text;

-- Table for persisted saved/bookmarked profiles
CREATE TABLE IF NOT EXISTS public.saved_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_type text NOT NULL CHECK (profile_type IN ('concierge', 'menage', 'designer')),
  profile_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, profile_type, profile_id)
);

ALTER TABLE public.saved_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own saves"
  ON public.saved_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saves"
  ON public.saved_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saves"
  ON public.saved_profiles FOR DELETE
  USING (auth.uid() = user_id);
