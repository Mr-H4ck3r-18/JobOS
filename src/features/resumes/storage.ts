import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const DEFAULT_BUCKET = "resumes";

export function getResumeBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
}

export function buildResumeStoragePath(userId: string, resumeId: string, fileName: string) {
  const safeName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 96);

  return `${userId}/${resumeId}/${Date.now()}-${safeName}`;
}

export async function uploadResumeFile({
  path,
  file,
}: {
  path: string;
  file: File;
}) {
  const supabase = createSupabaseAdminClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(getResumeBucketName()).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function createResumeSignedUrl(path: string | null) {
  if (!path || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(getResumeBucketName())
    .createSignedUrl(path, 60 * 10);

  if (error) {
    return null;
  }

  return data.signedUrl;
}
