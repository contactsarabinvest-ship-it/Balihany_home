-- Add admin role for benkiranesara@outlook.fr
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'benkiranesara@outlook.fr'
ON CONFLICT (user_id, role) DO NOTHING;
