/** 저장하려는 변환 결과(프롬프트는 포함하지 않는다). */
export type ArticleDraft = {
  title: string;
  author: string;
  site: string;
  wordCount: number;
  markdown: string;
  url: string;
};

export type SavedArticle = ArticleDraft & {
  id: string;
  createdAt: string;
};

export type SaveResult =
  | { status: "saved"; id: string }
  | { status: "unauthenticated" }
  | { status: "error"; message: string };
