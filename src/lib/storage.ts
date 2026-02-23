import imageCompression from "browser-image-compression";
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

const SKIP_COMPRESS_LOGO_BYTES = 300 * 1024;   // 300 KB — pas de compression si déjà petit
const SKIP_COMPRESS_PORTFOLIO_BYTES = 800 * 1024; // 800 KB

async function compressImage(
  file: File,
  options: { maxSizeMB: number; maxWidthOrHeight: number; quality: number; skipIfUnder?: number }
): Promise<File> {
  if (options.skipIfUnder && file.size < options.skipIfUnder) return file;
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      initialQuality: options.quality,
      useWebWorker: false, // plus rapide pour les images moyennes
    });
    return new File([compressed], file.name, { type: compressed.type });
  } catch {
    return file;
  }
}

export async function uploadLogo(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/logo-${Date.now()}.${ext}`;

  const toUpload = await compressImage(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 512,
    quality: 0.85,
    skipIfUnder: SKIP_COMPRESS_LOGO_BYTES,
  });

  const { error } = await supabase.storage.from(LOGOS_BUCKET).upload(path, toUpload, {
    upsert: true,
  });

  if (error) throw error;
  return getPublicUrl(LOGOS_BUCKET, path);
}

export async function uploadPortfolioImage(userId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/${Date.now()}-${file.name}`;

  const toUpload = await compressImage(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    quality: 0.85,
    skipIfUnder: SKIP_COMPRESS_PORTFOLIO_BYTES,
  });

  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, toUpload, {
    upsert: false,
  });

  if (error) throw error;
  return getPublicUrl(PORTFOLIO_BUCKET, path);
}
