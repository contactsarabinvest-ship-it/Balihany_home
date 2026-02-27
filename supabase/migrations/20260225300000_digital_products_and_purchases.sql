-- Digital products catalog
CREATE TABLE IF NOT EXISTS public.digital_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_en text NOT NULL,
  name_ar text NOT NULL DEFAULT '',
  description_fr text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  description_ar text NOT NULL DEFAULT '',
  price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  thumbnail_url text,
  file_path text NOT NULL,
  stripe_price_id text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.digital_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active products"
  ON public.digital_products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage products"
  ON public.digital_products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Purchases / orders
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id uuid NOT NULL REFERENCES public.digital_products(id) ON DELETE RESTRICT,
  stripe_session_id text UNIQUE,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  download_token uuid NOT NULL DEFAULT gen_random_uuid(),
  downloaded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all purchases"
  ON public.purchases FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Service role can insert purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (true);

-- Private bucket for digital product files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('digital-products', 'digital-products', false, 104857600)
ON CONFLICT (id) DO NOTHING;
