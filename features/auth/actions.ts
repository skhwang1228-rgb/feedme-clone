"use server";

import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; saved?: boolean };

export async function updateDisplayName(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { error: "로그인이 필요합니다." };

  const displayName = String(formData.get("display_name") ?? "").trim();
  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null })
    .eq("id", data.claims.sub);

  return error ? { error: error.message } : { saved: true };
}
