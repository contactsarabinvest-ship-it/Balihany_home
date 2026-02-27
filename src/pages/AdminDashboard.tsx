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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Check, X, ArrowLeft, ImageIcon, Building2, Paintbrush, Sparkles, Mail, Calculator, Star, MessageSquare, Trash2, ShoppingBag, Plus, Pencil, ToggleLeft, ToggleRight, Search, Ban } from "lucide-react";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [leadToDelete, setLeadToDelete] = useState<{ type: "contact" | "calculator"; id: string } | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [seenCounts, setSeenCounts] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem("admin-seen-counts");
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });

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

  const { data: adminProducts, refetch: refetchProducts } = useQuery({
    queryKey: ["admin-products", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("digital_products")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const { data: adminPurchases } = useQuery({
    queryKey: ["admin-purchases", userId, isAdmin],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*, digital_products(name_fr)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!userId && isAdmin === true,
  });

  const [productForm, setProductForm] = useState<{
    id?: string;
    name_fr: string; name_en: string; name_ar: string;
    description_fr: string; description_en: string; description_ar: string;
    price_cents: string; currency: string;
    thumbnail_url: string; file_path: string;
    is_active: boolean; sort_order: string;
  } | null>(null);

  const openNewProduct = () => setProductForm({
    name_fr: "", name_en: "", name_ar: "",
    description_fr: "", description_en: "", description_ar: "",
    price_cents: "", currency: "EUR",
    thumbnail_url: "", file_path: "",
    is_active: true, sort_order: "0",
  });

  const openEditProduct = (p: any) => setProductForm({
    id: p.id,
    name_fr: p.name_fr, name_en: p.name_en, name_ar: p.name_ar,
    description_fr: p.description_fr, description_en: p.description_en, description_ar: p.description_ar,
    price_cents: String(p.price_cents), currency: p.currency,
    thumbnail_url: p.thumbnail_url || "", file_path: p.file_path,
    is_active: p.is_active, sort_order: String(p.sort_order),
  });

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm) return;
    setProcessing("product-save");
    const payload = {
      name_fr: productForm.name_fr,
      name_en: productForm.name_en,
      name_ar: productForm.name_ar,
      description_fr: productForm.description_fr,
      description_en: productForm.description_en,
      description_ar: productForm.description_ar,
      price_cents: parseInt(productForm.price_cents) || 0,
      currency: productForm.currency || "EUR",
      thumbnail_url: productForm.thumbnail_url || null,
      file_path: productForm.file_path,
      is_active: productForm.is_active,
      sort_order: parseInt(productForm.sort_order) || 0,
    };
    let error;
    if (productForm.id) {
      ({ error } = await supabase.from("digital_products").update(payload).eq("id", productForm.id));
    } else {
      ({ error } = await supabase.from("digital_products").insert(payload));
    }
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: productForm.id ? "Product updated" : "Product created" });
    setProductForm(null);
    refetchProducts();
    queryClient.invalidateQueries({ queryKey: ["admin-purchases"] });
  };

  const toggleProductActive = async (id: string, current: boolean) => {
    setProcessing(`toggle-${id}`);
    const { error } = await supabase.from("digital_products").update({ is_active: !current }).eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    refetchProducts();
  };

  const deleteProduct = async (id: string) => {
    const sales = purchaseCountForProduct(id);
    if (sales > 0) {
      toast({ title: `Ce produit a ${sales} achat(s). Désactivez-le plutôt que de le supprimer.`, variant: "destructive" });
      return;
    }
    setProcessing(`del-product-${id}`);
    const { error } = await supabase.from("digital_products").delete().eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Produit supprimé" });
    refetchProducts();
  };

  const purchaseCountForProduct = (productId: string) =>
    adminPurchases?.filter((p) => p.product_id === productId).length ?? 0;

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
    queryClient.invalidateQueries({ queryKey: ["admin-all-submissions"] });
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
    queryClient.invalidateQueries({ queryKey: ["admin-all-submissions"] });
  };

  const disableCompany = async (id: string, type: "concierge" | "designer" | "menage") => {
    setProcessing(`disable-${type}-${id}`);
    const table = getTableName(type);
    const { error } = await supabase.from(table).update({ status: "rejected" }).eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profil désactivé" });
    queryClient.invalidateQueries({ queryKey: ["admin-all-submissions"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-companies"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-designers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-menage"] });
  };

  const reactivateCompany = async (id: string, type: "concierge" | "designer" | "menage") => {
    setProcessing(`reactivate-${type}-${id}`);
    const table = getTableName(type);
    const { error } = await supabase.from(table).update({ status: "approved" }).eq("id", id);
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profil réactivé" });
    queryClient.invalidateQueries({ queryKey: ["admin-all-submissions"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-companies"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-designers"] });
    queryClient.invalidateQueries({ queryKey: ["admin-pending-menage"] });
  };

  const deleteContactLead = async (id: string) => {
    setProcessing(`contact-${id}`);
    const { data, error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id)
      .select("id");
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    if (!data?.length) {
      toast({
        title: "Suppression refusée (droits ou migration RLS manquante)",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Lead contact supprimé" });
    queryClient.invalidateQueries({ queryKey: ["admin-contact-leads"] });
  };

  const deleteCalculatorLead = async (id: string) => {
    setProcessing(`calc-${id}`);
    const { data, error } = await supabase
      .from("calculator_leads")
      .delete()
      .eq("id", id)
      .select("id");
    setProcessing(null);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
      return;
    }
    if (!data?.length) {
      toast({
        title: "Suppression refusée (droits ou migration RLS manquante)",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Lead calculateur supprimé" });
    queryClient.invalidateQueries({ queryKey: ["admin-calculator-leads"] });
  };

  const tabCounts: Record<string, number> = {
    inscriptions: allSubmissions?.length ?? 0,
    companies: (pendingCompanies?.length ?? 0) + (pendingDesigners?.length ?? 0) + (pendingMenage?.length ?? 0),
    photos: itemsWithPendingPhotos?.length ?? 0,
    reviews: pendingReviews?.length ?? 0,
    products: adminProducts?.length ?? 0,
    leads: (contactLeads?.length ?? 0) + (calculatorLeads?.length ?? 0),
  };

  const hasNew = (tab: string) => {
    const current = tabCounts[tab] ?? 0;
    return current > 0 && current > (seenCounts[tab] ?? 0);
  };

  const handleTabChange = (tab: string) => {
    const updated = { ...seenCounts, [tab]: tabCounts[tab] ?? 0 };
    setSeenCounts(updated);
    localStorage.setItem("admin-seen-counts", JSON.stringify(updated));
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

        <Tabs defaultValue="inscriptions" className="space-y-6" onValueChange={handleTabChange}>
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="inscriptions">
              Inscriptions
              {tabCounts.inscriptions > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("inscriptions") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.inscriptions}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="companies">
              En attente
              {tabCounts.companies > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("companies") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.companies}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="photos">
              Photos
              {tabCounts.photos > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("photos") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.photos}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Avis
              {tabCounts.reviews > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("reviews") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.reviews}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products">
              Produits
              {tabCounts.products > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("products") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.products}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="leads">
              Leads
              {tabCounts.leads > 0 && (
                <Badge variant="secondary" className={`ml-2 ${hasNew("leads") ? "bg-green-500 text-white" : ""}`}>
                  {tabCounts.leads}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inscriptions" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Toutes les demandes d&apos;inscription (conciergerie, ménage, designers) avec leur statut.
            </p>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ville ou type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {(() => {
              const q = searchQuery.toLowerCase().trim();
              const filtered = (allSubmissions ?? []).filter((item) => {
                if (!q) return true;
                const typeLabel = item.type === "concierge" ? "conciergerie" : item.type === "menage" ? "ménage" : "designer";
                return (
                  item.name?.toLowerCase().includes(q) ||
                  item.city_fr?.toLowerCase().includes(q) ||
                  typeLabel.includes(q) ||
                  item.status?.toLowerCase().includes(q)
                );
              });
              return !filtered.length ? (
                <Card className="rounded-2xl">
                  <CardContent className="py-12 text-center">
                    <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {q ? "Aucun résultat pour cette recherche." : "Aucune inscription trouvée."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filtered.map((item) => (
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
                          {item.status === "approved" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 rounded-full text-orange-600 hover:bg-orange-50"
                              onClick={() => disableCompany(item.id, item.type)}
                              disabled={!!processing}
                            >
                              <Ban className="h-4 w-4" />
                              Désactiver
                            </Button>
                          )}
                          {item.status === "rejected" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 rounded-full text-green-600 hover:bg-green-50"
                              onClick={() => reactivateCompany(item.id, item.type)}
                              disabled={!!processing}
                            >
                              <Check className="h-4 w-4" />
                              Réactiver
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              );
            })()}
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

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Gérez vos produits digitaux (templates, guides, etc.)
              </p>
              <Button size="sm" className="gap-1.5 rounded-full" onClick={openNewProduct}>
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>

            {productForm && (
              <Card className="rounded-xl border-accent/30">
                <CardContent className="py-4">
                  <form onSubmit={handleSaveProduct} className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label className="text-xs">Nom FR</Label>
                        <Input value={productForm.name_fr} onChange={(e) => setProductForm((f) => f ? { ...f, name_fr: e.target.value } : f)} required className="rounded-lg h-9" />
                      </div>
                      <div>
                        <Label className="text-xs">Nom EN</Label>
                        <Input value={productForm.name_en} onChange={(e) => setProductForm((f) => f ? { ...f, name_en: e.target.value } : f)} required className="rounded-lg h-9" />
                      </div>
                      <div>
                        <Label className="text-xs">Nom AR</Label>
                        <Input value={productForm.name_ar} onChange={(e) => setProductForm((f) => f ? { ...f, name_ar: e.target.value } : f)} className="rounded-lg h-9" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label className="text-xs">Description FR</Label>
                        <Textarea value={productForm.description_fr} onChange={(e) => setProductForm((f) => f ? { ...f, description_fr: e.target.value } : f)} rows={2} className="rounded-lg text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Description EN</Label>
                        <Textarea value={productForm.description_en} onChange={(e) => setProductForm((f) => f ? { ...f, description_en: e.target.value } : f)} rows={2} className="rounded-lg text-sm" />
                      </div>
                      <div>
                        <Label className="text-xs">Description AR</Label>
                        <Textarea value={productForm.description_ar} onChange={(e) => setProductForm((f) => f ? { ...f, description_ar: e.target.value } : f)} rows={2} className="rounded-lg text-sm" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label className="text-xs">Prix (centimes)</Label>
                        <Input type="number" min="0" value={productForm.price_cents} onChange={(e) => setProductForm((f) => f ? { ...f, price_cents: e.target.value } : f)} required className="rounded-lg h-9" placeholder="2900 = 29 EUR" />
                      </div>
                      <div>
                        <Label className="text-xs">Devise</Label>
                        <Input value={productForm.currency} onChange={(e) => setProductForm((f) => f ? { ...f, currency: e.target.value } : f)} className="rounded-lg h-9" placeholder="EUR" />
                      </div>
                      <div>
                        <Label className="text-xs">Ordre d'affichage</Label>
                        <Input type="number" value={productForm.sort_order} onChange={(e) => setProductForm((f) => f ? { ...f, sort_order: e.target.value } : f)} className="rounded-lg h-9" />
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label className="text-xs">URL miniature</Label>
                        <Input value={productForm.thumbnail_url} onChange={(e) => setProductForm((f) => f ? { ...f, thumbnail_url: e.target.value } : f)} className="rounded-lg h-9" placeholder="https://..." />
                      </div>
                      <div>
                        <Label className="text-xs">Chemin fichier (bucket digital-products)</Label>
                        <Input value={productForm.file_path} onChange={(e) => setProductForm((f) => f ? { ...f, file_path: e.target.value } : f)} required className="rounded-lg h-9" placeholder="templates/mon-template.xlsx" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={productForm.is_active} onChange={(e) => setProductForm((f) => f ? { ...f, is_active: e.target.checked } : f)} className="rounded" />
                        Actif
                      </label>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => setProductForm(null)}>
                          Annuler
                        </Button>
                        <Button type="submit" size="sm" className="rounded-full gap-1.5" disabled={processing === "product-save"}>
                          <Check className="h-4 w-4" />
                          {productForm.id ? "Modifier" : "Créer"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {!adminProducts?.length && !productForm ? (
              <Card className="rounded-2xl">
                <CardContent className="py-12 text-center">
                  <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Aucun produit. Ajoutez votre premier produit.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {adminProducts?.map((p) => (
                  <Card key={p.id} className="rounded-xl">
                    <CardContent className="py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {p.thumbnail_url ? (
                            <img src={p.thumbnail_url} alt={p.name_fr} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                              <ShoppingBag className="h-6 w-6 text-accent" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{p.name_fr}</p>
                            <p className="text-sm text-muted-foreground">
                              {(p.price_cents / 100).toFixed(p.price_cents % 100 === 0 ? 0 : 2)} {p.currency.toUpperCase()}
                              <span className="mx-2 text-muted-foreground/40">·</span>
                              {purchaseCountForProduct(p.id)} ventes
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={p.is_active ? "default" : "secondary"}>
                            {p.is_active ? "Actif" : "Inactif"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => toggleProductActive(p.id, p.is_active)}
                            disabled={!!processing}
                            title={p.is_active ? "Désactiver" : "Activer"}
                          >
                            {p.is_active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-full"
                            onClick={() => openEditProduct(p)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Modifier
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-full text-destructive hover:bg-destructive/10"
                            onClick={() => setProductToDelete(p.id)}
                            disabled={!!processing}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Recent purchases */}
            <div className="mt-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Mail className="h-4 w-4" />
                Achats récents
              </h3>
              {!adminPurchases?.length ? (
                <Card className="rounded-xl">
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    Aucun achat pour le moment.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {adminPurchases.map((purchase) => (
                    <Card key={purchase.id} className="rounded-xl">
                      <CardContent className="py-3">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <a href={`mailto:${purchase.email}`} className="text-sm font-medium text-accent hover:underline">{purchase.email}</a>
                            <p className="text-xs text-muted-foreground">
                              {(purchase as any).digital_products?.name_fr || "—"}
                              <span className="mx-2 text-muted-foreground/40">·</span>
                              {(purchase.amount_cents / 100).toFixed(2)} {purchase.currency.toUpperCase()}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{formatDate(purchase.created_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
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
                          <div className="flex items-center gap-2 shrink-0">
                            <p className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 rounded-full p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => setLeadToDelete({ type: "contact", id: lead.id })}
                              disabled={processing === `contact-${lead.id}`}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
                          <div className="flex items-center gap-2 shrink-0">
                            <p className="text-xs text-muted-foreground">{formatDate(lead.created_at)}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 rounded-full p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => setLeadToDelete({ type: "calculator", id: lead.id })}
                              disabled={processing === `calc-${lead.id}`}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce lead ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer ce lead ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!leadToDelete) return;
                if (leadToDelete.type === "contact") await deleteContactLead(leadToDelete.id);
                else await deleteCalculatorLead(leadToDelete.id);
                setLeadToDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce produit ?</AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous vraiment supprimer ce produit digital ? Les achats existants seront conservés mais le produit ne sera plus disponible. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (!productToDelete) return;
                await deleteProduct(productToDelete);
                setProductToDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
};

export default AdminDashboard;
