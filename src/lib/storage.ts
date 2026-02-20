import { supabase } from "@/integrations/supabase/client";

const LOGOS_BUCKET = "logos";
const PORTFOLIO_BUCKET = "portfolio";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_LOGO_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_PORTFOLIO_SIZE = 100 * 1024 * 1024; // 100MB

export function validateImageFile(file: File, type: "logo" | "portfolio"): string | null {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, WebP and GIF images are allowed.";
  }
  const maxSize = type === "logo" ? MAX_LOGO_SIZE : MAX_PORTFOLIO_SIZE;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return `File size must be under ${maxMB}MB.`;
  }
  return null;
}

function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadLogo(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/logo-${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(LOGOS_BUCKET).upload(path, file, {
    upsert: true,
  });

  if (error) throw error;
  return getPublicUrl(LOGOS_BUCKET, path);
}

export async function uploadPortfolioImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, file, {
    upsert: false,
  });

  if (error) throw error;
  return getPublicUrl(PORTFOLIO_BUCKET, path);
}
