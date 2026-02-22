-- =============================================================
-- SETUP: Email notifications quand un client contacte un pro
-- =============================================================
-- Prérequis: la Edge Function "notify-pro" doit être déployée.
--
-- Ce script crée un Database Webhook qui appelle la Edge Function
-- à chaque INSERT dans contact_submissions.
--
-- INSTRUCTIONS:
--   1. Va dans Supabase Dashboard → Database → Webhooks
--   2. Clique "Create a new hook"
--   3. Name: notify-pro-on-contact
--   4. Table: contact_submissions
--   5. Events: INSERT
--   6. Type: Supabase Edge Function
--   7. Edge Function: notify-pro
--   8. HTTP Headers: Authorization = Bearer <ton SUPABASE_SERVICE_ROLE_KEY>
--   9. Save
--
-- OU exécute ce SQL (remplace <PROJECT_REF> par ton project ref):
-- NOTE: pg_net doit être activé (il l'est par défaut sur Supabase)

-- Activer pg_net si pas déjà fait
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Fonction trigger qui appelle la Edge Function
CREATE OR REPLACE FUNCTION public.notify_pro_on_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _url text;
  _service_key text;
BEGIN
  -- Seuls les messages envoyés depuis un profil pro déclenchent la notification
  IF NEW.source !~ '^(concierge|menage|designer)-' THEN
    RETURN NEW;
  END IF;

  -- URL de la Edge Function (à adapter avec ton project ref)
  -- Format: https://<PROJECT_REF>.supabase.co/functions/v1/notify-pro
  _url := current_setting('app.settings.edge_function_url', true);

  IF _url IS NULL OR _url = '' THEN
    RAISE WARNING 'app.settings.edge_function_url not set — skipping notification';
    RETURN NEW;
  END IF;

  _service_key := current_setting('app.settings.service_role_key', true);

  PERFORM extensions.http_post(
    url := _url,
    body := json_build_object('record', row_to_json(NEW))::text,
    headers := json_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(_service_key, '')
    )::jsonb
  );

  RETURN NEW;
END;
$$;

-- Créer le trigger
DROP TRIGGER IF EXISTS trg_notify_pro_on_contact ON public.contact_submissions;
CREATE TRIGGER trg_notify_pro_on_contact
  AFTER INSERT ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pro_on_contact();

-- ⚠️ IMPORTANT: Configure ces paramètres dans Supabase SQL Editor :
-- ALTER DATABASE postgres SET app.settings.edge_function_url = 'https://<PROJECT_REF>.supabase.co/functions/v1/notify-pro';
-- ALTER DATABASE postgres SET app.settings.service_role_key = '<ta SERVICE_ROLE_KEY>';
-- Puis relance le serveur (ou attends le prochain redémarrage).
