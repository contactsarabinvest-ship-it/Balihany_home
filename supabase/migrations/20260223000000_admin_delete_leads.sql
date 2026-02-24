-- Allow admins to delete contact submissions and calculator leads

CREATE POLICY "Admins can delete contact submissions"
ON public.contact_submissions FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete calculator leads"
ON public.calculator_leads FOR DELETE
USING (public.has_role(auth.uid(), 'admin'::app_role));
