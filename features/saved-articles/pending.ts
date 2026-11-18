import type { ArticleDraft } from "./types";

const KEY = "pending-save";

// 비로그인 저장 때 로그인 화면을 다녀오는 동안 변환 결과를 같은 탭의 sessionStorage에 보존한다.
export function stashPending(draft: ArticleDraft) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // 저장소가 막혀 있으면 보존 없이 로그인만 진행한다.
  }
}

/** 보존한 결과를 꺼내며 지운다. 없거나 깨졌으면 null. */
export function takePending(): ArticleDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (typeof d?.markdown !== "string" || typeof d?.url !== "string") return null;
    return {
      title: String(d.title ?? ""),
      author: String(d.author ?? ""),
      site: String(d.site ?? ""),
      wordCount: Number(d.wordCount) || 0,
      markdown: d.markdown,
      url: d.url,
    };
  } catch {
    return null;
  }
}
