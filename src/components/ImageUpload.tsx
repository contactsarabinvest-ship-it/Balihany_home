import { useCallback, useState } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
}

export function LogoUpload({ value, onChange, label, hint, className, disabled }: ImageUploadProps) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayUrl = previewUrl || value;

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const { validateImageFile, uploadLogo } = await import("@/lib/storage");
      const validation = validateImageFile(file, "logo");
      if (validation) {
        setError(validation);
        return;
      }
      setError(null);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setUploading(true);
      try {
        const { data: { user } } = await import("@/integrations/supabase/client").then((m) => m.supabase.auth.getUser());
        if (!user) {
          setError(t("upload.loginRequired") as string);
          return;
        }
        const url = await uploadLogo(user.id, file);
        onChange(url);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("session") || msg.includes("auth") || msg.includes("JWT")) {
          setError(t("upload.confirmEmailFirst") as string);
        } else {
          setError(msg || (t("upload.failed") as string));
        }
      } finally {
        setUploading(false);
        setPreviewUrl(null);
        URL.revokeObjectURL(objectUrl);
        e.target.value = "";
      }
    },
    [onChange, t]
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
          {displayUrl ? (
            <img src={displayUrl} alt="Logo preview" className="h-full w-full object-cover" loading="eager" />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              className="hidden"
              disabled={disabled || uploading}
            />
            <span
              className={cn(
                "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground",
                (disabled || uploading) && "pointer-events-none opacity-50"
              )}
            >
              {uploading ? "..." : <><Upload className="h-4 w-4" /> {value ? "Replace" : "Upload"}</>}
            </span>
          </label>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-destructive hover:text-destructive"
              onClick={() => onChange(null)}
              disabled={disabled}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

interface PortfolioUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  disabled?: boolean;
  maxFiles?: number;
}

export function PortfolioUpload({
  value,
  onChange,
  label,
  hint,
  className,
  disabled,
  maxFiles = 10,
}: PortfolioUploadProps) {
  const { t } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const displayUrls = [...value, ...previewUrls];

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const { validateImageFile, uploadPortfolioImage } = await import("@/lib/storage");
      const { data: { user } } = await import("@/integrations/supabase/client").then((m) => m.supabase.auth.getUser());
      if (!user) {
        setError(t("upload.loginRequired") as string);
        return;
      }

      const remaining = maxFiles - value.length;
      const toUpload = files.slice(0, remaining);
      if (toUpload.length < files.length) {
        setError(`Maximum ${maxFiles} images. Some files were skipped.`);
      } else {
        setError(null);
      }

      const validFiles: File[] = [];
      for (const f of toUpload) {
        const v = validateImageFile(f, "portfolio");
        if (v) setError(v);
        else validFiles.push(f);
      }
      const objectUrls = validFiles.map((f) => URL.createObjectURL(f));
      setPreviewUrls(objectUrls);
      setUploading(true);

      const newUrls: string[] = [];
      for (const file of validFiles) {
        try {
          const url = await uploadPortfolioImage(user.id, file);
          newUrls.push(url);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes("session") || msg.includes("auth") || msg.includes("JWT")) {
            setError(t("upload.confirmEmailFirst") as string);
          } else {
            setError(msg || (t("upload.failed") as string));
          }
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
      }
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
      setPreviewUrls([]);
      setUploading(false);
      e.target.value = "";
    },
    [onChange, value, maxFiles, t]
  );

  const remove = (index: number) => {
    if (index < value.length) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {displayUrls.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <img src={url} alt={`Portfolio ${i + 1}`} className="h-full w-full object-cover" loading="eager" />
            {!disabled && i < value.length && (
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        {displayUrls.length < maxFiles && (
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={handleUpload}
              className="hidden"
              disabled={disabled || uploading}
            />
            {uploading ? (
              <span className="text-xs text-muted-foreground">Uploading...</span>
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add</span>
              </>
            )}
          </label>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
