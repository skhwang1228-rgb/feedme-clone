"use server";

import { createClient } from "@/lib/supabase/server";
import type { ArticleDraft, SaveResult } from "./types";

export async function saveArticle(draft: ArticleDraft): Promise<SaveResult> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { status: "unauthenticated" };

  if (!draft?.markdown || !draft.url) {
    return { status: "error", message: "저장할 내용이 없습니다." };
  }

  const { data: row, error } = await supabase
    .from("saved_articles")
    .insert({
      user_id: data.claims.sub,
      title: draft.title ?? "",
      author: draft.author ?? "",
      site: draft.site ?? "",
      word_count: draft.wordCount ?? 0,
      markdown: draft.markdown,
      source_url: draft.url,
    })
    .select("id")
    .single();

  if (error || !row) {
    return { status: "error", message: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
  return { status: "saved", id: row.id };
}
