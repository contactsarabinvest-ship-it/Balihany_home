import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthModal } from "@/contexts/AuthModalContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, X } from "lucide-react";

export function LoginModal() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isOpen, close, onSuccessRef } = useAuthModal();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    setForm({ email: "", password: "" });
    const cb = onSuccessRef.current;
    close();
    cb?.();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    setLoading(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-background p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
            <LogIn className="h-7 w-7 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("auth.login.title") as string}
          </h2>
        </div>

        <form onSubmit={handleLogin} className="grid gap-4">
          <Input
            type="email"
            placeholder={t("form.email") as string}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
            className="rounded-lg"
          />
          <Input
            type="password"
            placeholder={t("form.password") as string}
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
            className="rounded-lg"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
          >
            {loading ? "..." : (t("auth.login.cta") as string)}
          </Button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("form.or") as string}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-full gap-2"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("auth.login.google") as string}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t("auth.login.noAccount") as string}{" "}
            <Link
              to="/concierge-signup"
              onClick={close}
              className="text-accent hover:underline"
            >
              {t("nav.signup") as string}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
