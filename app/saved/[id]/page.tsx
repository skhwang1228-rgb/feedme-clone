import { ExternalLinkIcon } from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { buttonVariants } from "@/components/ui/button";
import { getSavedArticle } from "@/features/saved-articles/queries.server";
import { ExportPanel } from "@/features/url-to-markdown/components/export-panel";
import { ResultCard } from "@/features/url-to-markdown/components/result-card";

// 저장한 글과 변환 기능은 서로 모른다. 이 화면(상위)에서 변환 결과 컴포넌트를 재사용해 조합한다.
export default async function SavedArticlePage({
  params,
}: PageProps<"/saved/[id]">) {
  const { id } = await params;
  const article = await getSavedArticle(id);
  if (!article) notFound();

  return (
    <AppShell title="저장한 글" back={{ href: "/saved", label: "목록" }}>
      <ResultCard page={article} />
      <div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline" })}
        >
          <ExternalLinkIcon />
          원본 페이지 열기
        </a>
      </div>
      <ExportPanel page={article} />
    </AppShell>
  );
}
