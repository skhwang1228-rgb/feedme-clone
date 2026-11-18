import { createClient } from "@/lib/supabase/server";
import type { SavedArticle } from "./types";

type Row = {
  id: string;
  title: string;
  author: string;
  site: string;
  word_count: number;
  markdown: string;
  source_url: string;
  created_at: string;
};

const COLUMNS = "id,title,author,site,word_count,markdown,source_url,created_at";

function toArticle(r: Row): SavedArticle {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    site: r.site,
    wordCount: r.word_count,
    markdown: r.markdown,
    url: r.source_url,
    createdAt: r.created_at,
  };
}

/** 내 저장한 글 목록(최신순). RLS가 본인 것만 돌려준다. */
export async function listSavedArticles(): Promise<SavedArticle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_articles")
    .select(COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw new Error("저장한 글을 불러오지 못했습니다.");
  return (data as Row[]).map(toArticle);
}

/** 없거나 내 것이 아니면 null(둘은 구분하지 않는다). */
export async function getSavedArticle(id: string): Promise<SavedArticle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("saved_articles")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return toArticle(data as Row);
}
