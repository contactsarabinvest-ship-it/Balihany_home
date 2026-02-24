import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, X, Globe, ChevronDown, Shield, User, Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import type { Language } from "@/lib/translations";

const langLabels: Record<Language, string> = { fr: "FR", en: "EN", ar: "عربي" };
const langFull: Record<Language, string> = { fr: "Français", en: "English", ar: "العربية" };

const Header = () => {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { concierge, menage, designers, isLoading, hasResults } = useGlobalSearch(searchQuery, { limit: 3 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setSearchQuery("");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const getCity = (row: { city_fr?: string; city_en?: string; city_ar?: string }) =>
    lang === "ar" ? (row.city_ar || row.city_fr) : lang === "en" ? row.city_en : row.city_fr;

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
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center gap-6 md:gap-8">
        {/* Logo — gauche */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/balihany-logo.png"
            alt="BaliHany"
            className="h-9 w-9 object-contain md:h-10 md:w-10"
          />
          <span className="text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
            BaliHany
          </span>
        </Link>

        {/* Barre de recherche — centre (style Houzz) */}
        <div className="hidden flex-1 min-w-0 max-w-xl md:flex" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder={t("nav.searchPlaceholder") as string}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(e.target.value.trim().length >= 2);
              }}
              onFocus={() => searchQuery.trim().length >= 2 && setSearchOpen(true)}
              className="h-9 w-full pl-9 pr-4 rounded-lg border-border bg-muted/40 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-accent/20"
            />
            {searchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-sm text-muted-foreground">{t("nav.searchPlaceholder") as string}...</div>
                ) : !hasResults ? (
                  <div className="p-4 text-sm text-muted-foreground">{t("search.noResults") as string}</div>
                ) : (
                  <div className="py-2">
                    {concierge.length > 0 && (
                      <div className="px-2 pb-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase px-2 py-1">{t("nav.concierge") as string}</p>
                        {concierge.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-md flex flex-col"
                            onClick={() => handleSearchSelect(`/concierge/${c.id}`)}
                          >
                            <span className="font-medium">{c.name}</span>
                            {getCity(c) && <span className="text-xs text-muted-foreground">{getCity(c)}</span>}
                          </button>
                        ))}
                      </div>
                    )}
                    {menage.length > 0 && (
                      <div className="px-2 pb-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase px-2 py-1">{t("nav.menage") as string}</p>
                        {menage.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-md flex flex-col"
                            onClick={() => handleSearchSelect(`/menage/${m.id}`)}
                          >
                            <span className="font-medium">{m.name}</span>
                            {getCity(m) && <span className="text-xs text-muted-foreground">{getCity(m)}</span>}
                          </button>
                        ))}
                      </div>
                    )}
                    {designers.length > 0 && (
                      <div className="px-2 pb-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase px-2 py-1">{t("nav.designers") as string}</p>
                        {designers.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            className="w-full text-left px-4 py-2 text-sm hover:bg-muted rounded-md flex flex-col"
                            onClick={() => handleSearchSelect(`/designers/${d.id}`)}
                          >
                            <span className="font-medium">{d.name}</span>
                            {getCity(d) && <span className="text-xs text-muted-foreground">{getCity(d)}</span>}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="border-t border-border mt-2 pt-2">
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm font-medium text-accent hover:bg-muted rounded-md"
                        onClick={() => handleSearchSelect(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                      >
                        {t("search.seeAll") as string}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Nav — après la recherche */}
        <nav className="hidden shrink-0 items-center gap-5 md:flex lg:gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${
              location.pathname === "/" ? "text-accent" : "text-muted-foreground"
            }`}
          >
            {t("nav.home") as string}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${
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
              className={`text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${
                location.pathname === link.to ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Langue + Compte — droite */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary">
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
                  <button className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
                    <User className="h-4 w-4 shrink-0" />
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
              <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-lg">
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
            <div className="flex gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("nav.searchPlaceholder") as string}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearchSelect(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="pl-9 rounded-full bg-muted/50"
                />
              </div>
              <Button
                type="button"
                size="sm"
                className="rounded-full shrink-0"
                onClick={() => searchQuery.trim() && handleSearchSelect(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
              >
                {t("search.seeAll") as string}
              </Button>
            </div>
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
