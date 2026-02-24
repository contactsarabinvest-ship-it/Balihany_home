import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe, ChevronDown, Shield, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/lib/translations";

const langLabels: Record<Language, string> = { fr: "FR", en: "EN", ar: "عربي" };
const langFull: Record<Language, string> = { fr: "Français", en: "English", ar: "العربية" };

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => setIsAdmin(data === true));
  }, [user?.id]);

  const findProsPaths = ["/concierge", "/menage", "/designers"];
  const isFindProsActive = findProsPaths.some((p) => location.pathname === p || location.pathname.startsWith(p + "/"));

  const findProsItems = [
    { to: "/concierge", label: t("nav.concierge") as string },
    { to: "/menage", label: t("nav.menage") as string },
    { to: "/designers", label: t("nav.designers") as string },
  ];

  const links = [
    { to: "/", label: t("nav.home") as string },
    { to: "/calculator", label: t("nav.calculator") as string },
    { to: "/blog", label: t("nav.blog") as string },
    { to: "/contact", label: t("nav.contact") as string },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/balihany-logo.png"
            alt="BaliHany"
            className="h-10 w-10 object-contain"
          />
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            BaliHany
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-accent ${
              location.pathname === "/" ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {t("nav.home") as string}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent ${
                  isFindProsActive ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {t("nav.findPros") as string}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {findProsItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {links.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === link.to ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
                <Globe className="h-4 w-4" />
                {langLabels[lang]}
                <ChevronDown className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(langFull) as Language[]).filter(l => l !== lang).map(l => (
                <DropdownMenuItem key={l} onClick={() => setLang(l)}>
                  {langFull[l]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                    <User className="h-4 w-4" />
                    <span className="max-w-[140px] truncate">
                      {(user.user_metadata?.display_name as string) || user.email}
                    </span>
                    <ChevronDown className="h-3 w-3 shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2 border-b border-border">
                    <p className="text-sm font-medium truncate">
                      {(user.user_metadata?.display_name as string) || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">{t("nav.dashboard") as string}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    {t("nav.logout") as string}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">{t("nav.login") as string}</Link>
              </Button>
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full">
                <Link to="/concierge-signup">{t("nav.signup") as string}</Link>
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-card px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium ${location.pathname === "/" ? "text-accent" : "text-muted-foreground"}`}
            >
              {t("nav.home") as string}
            </Link>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("nav.findPros") as string}
              </p>
              <div className="ml-2 flex flex-col gap-2">
                {findProsItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`text-sm ${
                      location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                        ? "font-medium text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            {links.slice(1).map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm font-medium ${
                  location.pathname === link.to ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <div className="px-0 py-2 border-b border-border mb-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {(user.user_metadata?.display_name as string) || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Admin
                  </Link>
                )}
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">
                  {t("nav.dashboard") as string}
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm font-medium text-muted-foreground text-start">
                  {t("nav.logout") as string}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-muted-foreground">
                  {t("nav.login") as string}
                </Link>
                <Link to="/concierge-signup" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-accent">
                  {t("nav.signup") as string}
                </Link>
              </>
            )}
            <div className="flex gap-2">
              {(Object.keys(langFull) as Language[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`text-sm font-medium px-2 py-1 rounded-full ${l === lang ? "bg-accent/10 text-accent" : "text-muted-foreground"}`}
                >
                  {langLabels[l]}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
