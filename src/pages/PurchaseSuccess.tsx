import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Download, ArrowLeft, AlertCircle } from "lucide-react";

const PurchaseSuccess = () => {
  const { lang, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "found" | "error">("loading");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id, product_id, download_token")
        .eq("stripe_session_id", sessionId)
        .maybeSingle();

      if (purchase) {
        const { data: product } = await supabase
          .from("digital_products")
          .select("name_fr, name_en, name_ar, file_path")
          .eq("id", purchase.product_id)
          .single();

        if (product) {
          const name = lang === "ar" ? product.name_ar || product.name_fr : lang === "en" ? product.name_en : product.name_fr;
          setProductName(name);

          const { data: signed } = await supabase.storage
            .from("digital-products")
            .createSignedUrl(product.file_path, 3600);

          if (signed?.signedUrl) {
            setDownloadUrl(signed.signedUrl);
          }
        }
        setStatus("found");
        return;
      }

      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        setStatus("error");
      }
    };

    poll();
  }, [sessionId, lang]);

  return (
    <main className="py-16 md:py-24">
      <PageMeta title={t("purchase.title") as string} description="" />
      <div className="container max-w-lg">
        {status === "loading" && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
              <p className="text-muted-foreground">{t("purchase.loading") as string}</p>
            </CardContent>
          </Card>
        )}

        {status === "found" && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {t("purchase.title") as string}
              </h1>
              <p className="text-muted-foreground max-w-sm">
                {t("purchase.subtitle") as string}
              </p>
              {productName && (
                <p className="font-medium text-foreground">{productName}</p>
              )}
              {downloadUrl && (
                <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 rounded-full mt-2">
                  <a href={downloadUrl} download>
                    <Download className="h-5 w-5" />
                    {t("purchase.download") as string}
                  </a>
                </Button>
              )}
              <Button asChild variant="ghost" className="gap-2 rounded-full mt-4">
                <Link to="/calculator">
                  <ArrowLeft className="h-4 w-4" />
                  {t("purchase.backCalc") as string}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {status === "error" && (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center gap-5 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-muted-foreground max-w-sm">
                {t("purchase.error") as string}
              </p>
              <Button asChild variant="outline" className="gap-2 rounded-full">
                <Link to="/calculator">
                  <ArrowLeft className="h-4 w-4" />
                  {t("purchase.backCalc") as string}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default PurchaseSuccess;
