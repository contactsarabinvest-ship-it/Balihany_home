import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";

const Login = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

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
    navigate("/dashboard");
  };

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
            <LogIn className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("auth.login.title") as string}
          </h1>
        </div>

        <Card className="rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="grid gap-4">
              <Input
                type="email"
                placeholder={t("form.email") as string}
                value={form.email}
                onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                required
                className="rounded-lg"
              />
              <Input
                type="password"
                placeholder={t("form.password") as string}
                value={form.password}
                onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                required
                className="rounded-lg"
              />
              <Button type="submit" disabled={loading} className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                {loading ? "..." : t("auth.login.cta") as string}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {t("auth.login.noAccount") as string}{" "}
                <Link to="/concierge-signup" className="text-accent hover:underline">{t("nav.signup") as string}</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Login;
