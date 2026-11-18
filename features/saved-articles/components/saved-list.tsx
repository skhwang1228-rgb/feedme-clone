import { BookmarkIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { SavedArticle } from "../types";

const formatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

export function SavedList({ articles }: { articles: SavedArticle[] }) {
  if (articles.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookmarkIcon />
          </EmptyMedia>
          <EmptyTitle>저장한 글이 없습니다</EmptyTitle>
          <EmptyDescription>
            URL을 변환한 뒤 &lsquo;저장&rsquo;을 누르면 여기에 모입니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href="/" className={buttonVariants()}>
            홈으로 가서 변환하기
          </Link>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {articles.map((a) => {
        const source = a.site || a.author;
        return (
          <li key={a.id}>
            <Link href={`/saved/${a.id}`} className="block rounded-xl focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none">
              <Card className="transition-colors hover:bg-muted/50">
                <CardHeader className="gap-1">
                  <CardTitle className="text-base leading-snug break-words">
                    {a.title || "제목 없음"}
                  </CardTitle>
                  <p className="flex flex-wrap gap-x-2.5 text-sm text-muted-foreground">
                    {source && <span>{source}</span>}
                    <time dateTime={a.createdAt}>
                      {formatter.format(new Date(a.createdAt))}
                    </time>
                  </p>
                </CardHeader>
              </Card>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
