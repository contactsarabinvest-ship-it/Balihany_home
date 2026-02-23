import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Shield, Check, X, ArrowLeft, ImageIcon, Building2, Paintbrush, Sparkles, Mail, Calculator, Star, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
      const { data } = await supabase.rpc("has_role", {
        _user_id: session.user.id,
        _role: "admin",
      });
      setIsAdmin(data === true);
      if (data !== true) {
        navigate("/");
      }
    });
  }, [navigate]);

  const { data: itemsWithPendingPhotos } = useQuery({
    queryKey: ["admin-pending-photos", userId, isAdmin],
    queryFn: async () => {
      const [companiesRes, designersRes, menageRes] = await Promise.all([
        supabase.from("concierge_companies").select("id, name, portfolio_photos, portfolio_photos_pending"),
        supabase.from("designers").select("id, name, portfolio_photos, portfolio_photos_pending"),
        supabase.from("menage_companies").select("id, name, portfolio_photos, portfolio_photos_pending"),
      ]);
      if (companiesRes.error) throw companiesRes.error;
      if (designersRes.error) throw designersRes.error;
      if (menageRes.error) throw menageRes.error;
      const companies = (companiesRes.data ?? []).filter((c) => (c.portfolio_photos_pending?.length ?? 0) > 0).map((c) => ({ ...c, type: "concierge" as const }));
      const designers = (designersRes.data ?? []).filter((d) => (d.portfolio_photos_pending?.length ?? 0) > 0).map((d) => ({ ...d, type: "designer" as const }));
      const menage = (menageRes.data ?? []).filter((m) => (m.portfolio_photos_pending?.length ?? 0) > 0).map((m) => ({ ...m, type: "menage" as const }));
      return [...companies, ...designers, ...menage];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: pendingCompanies } = useQuery({
    queryKey: ["admin-pending-companies", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concierge_companies")
        .select("id, name, city_fr, status")
        .eq("status", "pending");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: pendingDesigners } = useQuery({
    queryKey: ["admin-pending-designers", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("designers")
        .select("id, name, city_fr, status")
        .eq("status", "pending");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: pendingMenage } = useQuery({
    queryKey: ["admin-pending-menage", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menage_companies")
        .select("id, name, city_fr, status")
        .eq("status", "pending");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: allSubmissions } = useQuery({
    queryKey: ["admin-all-submissions", userId, isAdmin],
    queryFn: async () => {
      const [cRes, dRes, mRes] = await Promise.all([
        supabase.from("concierge_companies").select("id, name, city_fr, status, created_at").order("created_at", { ascending: false }),
        supabase.from("designers").select("id, name, city_fr, status, created_at").order("created_at", { ascending: false }),
        supabase.from("menage_companies").select("id, name, city_fr, status, created_at").order("created_at", { ascending: false }),
      ]);
      if (cRes.error) throw cRes.error;
      if (dRes.error) throw dRes.error;
      if (mRes.error) throw mRes.error;
      const concierge = (cRes.data ?? []).map((r) => ({ ...r, type: "concierge" as const }));
      const designers = (dRes.data ?? []).map((r) => ({ ...r, type: "designer" as const }));
      const menage = (mRes.data ?? []).map((r) => ({ ...r, type: "menage" as const }));
      return [...concierge, ...designers, ...menage].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: contactLeads } = useQuery({
    queryKey: ["admin-contact-leads", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: calculatorLeads } = useQuery({
    queryKey: ["admin-calculator-leads", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("calculator_leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: pendingReviews } = useQuery({
    queryKey: ["admin-pending-reviews", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const approveReview = async (reviewId: string) => {
    setProcessing(reviewId);
    const { error } = await supabase.from("reviews").update({ status: "approved" }).eq("id", reviewId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Review approved" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const rejectReview = async (reviewId: string) => {
    setProcessing(reviewId);
    const { error } = await supabase.from("reviews").update({ status: "rejected" }).eq("id", reviewId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Review rejected" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString(undefined, { dateStyle: "medium" });

  const getPhotoTable = (id: string) => itemsWithPendingPhotos?.find((i) => i.id === id);

  const getTableName = (type: string) =>
    type === "concierge" ? "concierge_companies" as const : type === "menage" ? "menage_companies" as const : "designers" as const;

  const approvePhoto = async (itemId: string, photoUrl: string) => {
    const item = getPhotoTable(itemId);
    if (!item) return;
    setProcessing(`${itemId}-${photoUrl}`);
    const table = getTableName(item.type);
    const approved = [...(item.portfolio_photos ?? []), photoUrl];
    const pending = (item.portfolio_photos_pending ?? []).filter((p) => p !== photoUrl);
    const { error } = await supabase.from(table).update({ portfolio_photos: approved, portfolio_photos_pending: pending }).eq("id", itemId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Photo approved" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
    queryClient.invalidateQueries({ queryKey: [item.type, itemId] });
  };

  const rejectPhoto = async (itemId: string, photoUrl: string) => {
    const item = getPhotoTable(itemId);
    if (!item) return;
    setProcessing(`${itemId}-${photoUrl}`);
    const table = getTableName(item.type);
    const pending = (item.portfolio_photos_pending ?? []).filter((p) => p !== photoUrl);
    const { error } = await supabase.from(table).update({ portfolio_photos_pending: pending }).eq("id", itemId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Photo rejected" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
    queryClient.invalidateQueries({ queryKey: [item.type, itemId] });
  };

  const approveAll = async (itemId: string) => {
    const item = getPhotoTable(itemId);
    if (!item || !item.portfolio_photos_pending?.length) return;
    setProcessing(itemId);
    const table = getTableName(item.type);
    const approved = [...(item.portfolio_photos ?? []), ...item.portfolio_photos_pending];
    const { error } = await supabase.from(table).update({ portfolio_photos: approved, portfolio_photos_pending: [] }).eq("id", itemId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "All photos approved" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
    queryClient.invalidateQueries({ queryKey: [item.type, itemId] });
  };

  const rejectAll = async (itemId: string) => {
    const item = getPhotoTable(itemId);
    if (!item) return;
    setProcessing(itemId);
    const table = getTableName(item.type);
    const { error } = await supabase.from(table).update({ portfolio_photos_pending: [] }).eq("id", itemId);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "All photos rejected" });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-photos"] });
    queryClient.invalidateQueries({ queryKey: [item.type, itemId] });
  };

  const approveCompany = async (id: string, type: "concierge" | "designer" | "menage") => {
    setProcessing(`${type}-${id}`);
    const table = getTableName(type);
    const { error } = await supabase.from(table).update({ status: "approved" }).eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${type} approved` });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-companies"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-designers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-menage"] });
  };

  const rejectCompany = async (id: string, type: "concierge" | "designer" | "menage") => {
    setProcessing(`${type}-${id}`);
    const table = getTableName(type);
    const { error } = await supabase.from(table).update({ status: "rejected" }).eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${type} rejected` });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-companies"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-designers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-menage"] });
  };

  if (isAdmin === null) {
    return (
      <main className="py-16">
        <div className="container">
          <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <Button asChild variant="ghost" className="mb-8 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
            <Shield className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin</h1>
            <p className="text-sm text-muted-foreground">
              Approve portfolio photos and new company listings
            </p>
          </div>
        </div>

        <Tabs defaultValue="inscriptions" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="inscriptions">
              Inscriptions
              {(allSubmissions?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {allSubmissions?.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="companies">
              En attente
              {(pendingCompanies?.length ?? 0) + (pendingDesigners?.length ?? 0) + (pendingMenage?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {(pendingCompanies?.length ?? 0) + (pendingDesigners?.length ?? 0) + (pendingMenage?.length ?? 0)}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="photos">
              Photos
              {(itemsWithPendingPhotos?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {itemsWithPendingPhotos?.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Avis
              {(pendingReviews?.length ?? 0) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingReviews?.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leads">
              Leads
              {((contactLeads?.length ?? 0) + (calculatorLeads?.length ?? 0)) > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {(contactLeads?.length ?? 0) + (calculatorLeads?.length ?? 0)}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inscriptions" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Toutes les demandes d&apos;inscription (conciergerie, ménage, designers) avec leur statut.
            </p>
            {!allSubmissions?.length ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucune inscription trouvée.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {allSubmissions.map((item) => (
                  <Card key={`${item.type}-${item.id}`} className="rounded-xl">
                    <CardHeader className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.type === "designer" ? "bg-terracotta-light" : "bg-accent/10"}`}>
                          {item.type === "concierge" ? (
                            <Building2 className="h-5 w-5 text-accent" />
                          ) : item.type === "menage" ? (
                            <Sparkles className="h-5 w-5 text-accent" />
                          ) : (
                            <Paintbrush className="h-5 w-5 text-terracotta" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {item.city_fr} • {item.type === "concierge" ? "Conciergerie" : item.type === "menage" ? "Ménage" : "Designer"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            item.status === "approved"
                              ? "default"
                              : item.status === "rejected"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.status === "approved" ? "Approuvé" : item.status === "rejected" ? "Rejeté" : "En attente"}
                        </Badge>
                        <Button asChild variant="ghost" size="sm" className="rounded-full">
                          <Link
                            to={
                              item.type === "concierge"
                                ? `/concierge/${item.id}`
                                : item.type === "menage"
                                  ? `/menage/${item.id}`
                                  : `/designers/${item.id}`
                            }
                          >
                            Voir
                          </Link>
                        </Button>
                        {item.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="gap-1.5 rounded-full bg-green-600 hover:bg-green-700"
                              onClick={() => approveCompany(item.id, item.type)}
                              disabled={!!processing}
                            >
                              <Check className="h-4 w-4" />
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => rejectCompany(item.id, item.type)}
                              disabled={!!processing}
                            >
                              <X className="h-4 w-4" />
                              Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            {(!pendingCompanies?.length && !pendingDesigners?.length && !pendingMenage?.length) ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                  <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending companies or designers to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pendingCompanies && pendingCompanies.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Concierge companies</h3>
                    <div className="space-y-3">
                      {pendingCompanies.map((c) => (
                        <Card key={c.id} className="rounded-xl">
                          <CardHeader className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                                <Building2 className="h-5 w-5 text-accent" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{c.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{c.city_fr}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                className="gap-1.5 rounded-full bg-green-600 hover:bg-green-700"
                                onClick={() => approveCompany(c.id, "concierge")}
                                disabled={!!processing}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                                onClick={() => rejectCompany(c.id, "concierge")}
                                disabled={!!processing}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="rounded-full">
                                <Link to={`/concierge/${c.id}`}>View</Link>
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {pendingDesigners && pendingDesigners.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Interior designers</h3>
                    <div className="space-y-3">
                      {pendingDesigners.map((d) => (
                        <Card key={d.id} className="rounded-xl">
                          <CardHeader className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-terracotta-light">
                                <Paintbrush className="h-5 w-5 text-terracotta" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{d.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{d.city_fr}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                className="gap-1.5 rounded-full bg-green-600 hover:bg-green-700"
                                onClick={() => approveCompany(d.id, "designer")}
                                disabled={!!processing}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                                onClick={() => rejectCompany(d.id, "designer")}
                                disabled={!!processing}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="rounded-full">
                                <Link to={`/designers/${d.id}`}>View</Link>
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {pendingMenage && pendingMenage.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Services de ménage</h3>
                    <div className="space-y-3">
                      {pendingMenage.map((m) => (
                        <Card key={m.id} className="rounded-xl">
                          <CardHeader className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                                <Sparkles className="h-5 w-5 text-accent" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{m.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{m.city_fr}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                className="gap-1.5 rounded-full bg-green-600 hover:bg-green-700"
                                onClick={() => approveCompany(m.id, "menage")}
                                disabled={!!processing}
                              >
                                <Check className="h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                                onClick={() => rejectCompany(m.id, "menage")}
                                disabled={!!processing}
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </Button>
                              <Button asChild variant="ghost" size="sm" className="rounded-full">
                                <Link to={`/menage/${m.id}`}>View</Link>
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos">
        {!itemsWithPendingPhotos?.length ? (
          <Card className="rounded-2xl">
            <CardContent className="py-12 text-center">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No pending portfolio photos to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {itemsWithPendingPhotos?.map((c) => (
              <Card key={c.id} className="rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{c.name}</CardTitle>
                      <Badge variant="outline" className="text-xs">{c.type === "concierge" ? "Concierge" : c.type === "menage" ? "Ménage" : "Designer"}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-full text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => approveAll(c.id)}
                        disabled={!!processing}
                      >
                        <Check className="h-4 w-4" />
                        Approve all
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                        onClick={() => rejectAll(c.id)}
                        disabled={!!processing}
                      >
                        <X className="h-4 w-4" />
                        Reject all
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {(c.portfolio_photos_pending ?? []).length} pending
                    </Badge>
                    <Button asChild variant="link" size="sm" className="h-auto p-0">
                      <Link to={c.type === "concierge" ? `/concierge/${c.id}` : c.type === "menage" ? `/menage/${c.id}` : `/designers/${c.id}`}>
                        View profile
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {(c.portfolio_photos_pending ?? []).map((url) => (
                      <div
                        key={url}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                      >
                        <img
                          src={url}
                          alt="Pending"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            size="sm"
                            className="h-8 rounded-full bg-green-600 hover:bg-green-700"
                            onClick={() => approvePhoto(c.id, url)}
                            disabled={processing === `${c.id}-${url}`}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 rounded-full"
                            onClick={() => rejectPhoto(c.id, url)}
                            disabled={processing === `${c.id}-${url}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {!pendingReviews?.length ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun avis en attente de modération.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((r) => (
                  <Card key={r.id} className="rounded-xl">
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{r.author_name}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{r.comment}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {r.concierge_company_id ? "Concierge" : r.menage_company_id ? "Ménage" : "Designer"}
                            </Badge>
                            <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                              <Link to={r.concierge_company_id ? `/concierge/${r.concierge_company_id}` : r.menage_company_id ? `/menage/${r.menage_company_id}` : `/designers/${r.designer_id}`}>
                                Voir le profil
                              </Link>
                            </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            className="gap-1.5 rounded-full bg-green-600 hover:bg-green-700"
                            onClick={() => approveReview(r.id)}
                            disabled={!!processing}
                          >
                            <Check className="h-4 w-4" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => rejectReview(r.id)}
                            disabled={!!processing}
                          >
                            <X className="h-4 w-4" />
                            Rejeter
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(r.created_at)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leads" className="space-y-6">
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Mail className="h-4 w-4" />
                Contact form submissions
              </h3>
              {!contactLeads?.length ? (
                <Card className="rounded-xl">
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No contact submissions yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {contactLeads.map((lead) => (
                    <Card key={lead.id} className="rounded-xl">
                      <CardContent className="py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <a href={`mailto:${lead.email}`} className="text-sm text-accent hover:underline">{lead.email}</a>
                            {lead.phone && <p className="text-sm text-muted-foreground">{lead.phone}</p>}
                            {lead.source && (
                              <Badge variant="outline" className="mt-1 text-xs">{lead.source}</Badge>
                            )}
                            {lead.message && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{lead.message}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0">{formatDate(lead.created_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Calculator className="h-4 w-4" />
                Calculator leads
              </h3>
              {!calculatorLeads?.length ? (
                <Card className="rounded-xl">
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No calculator leads yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {calculatorLeads.map((lead) => (
                    <Card key={lead.id} className="rounded-xl">
                      <CardContent className="py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <a href={`mailto:${lead.email}`} className="font-medium text-accent hover:underline">{lead.email}</a>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {lead.purchase_price != null && <span>Purchase: {Number(lead.purchase_price).toLocaleString()} MAD</span>}
                              {lead.nightly_rate != null && <span>Nightly: {Number(lead.nightly_rate)} MAD</span>}
                              {lead.occupancy_rate != null && <span>Occupancy: {lead.occupancy_rate}%</span>}
                              {lead.estimated_monthly_profit != null && (
                                <span className="font-medium text-foreground">Profit: {Number(lead.estimated_monthly_profit).toLocaleString()} MAD/mo</span>
                              )}
                              {lead.estimated_yearly_roi != null && (
                                <span className="font-medium text-foreground">ROI: {Number(lead.estimated_yearly_roi).toFixed(1)}%</span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground shrink-0">{formatDate(lead.created_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
