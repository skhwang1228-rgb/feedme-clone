import { AppShell } from "@/components/app-shell";
import { SavedList } from "@/features/saved-articles/components/saved-list";
import { listSavedArticles } from "@/features/saved-articles/queries.server";

export default async function SavedPage() {
  const articles = await listSavedArticles();
  return (
    <AppShell title="저장한 글" back={{ href: "/", label: "홈" }}>
      <SavedList articles={articles} />
    </AppShell>
  );
}
