import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConvertedPage as PageResult } from "../types";

const MD_STYLES =
  "text-sm leading-7 [&_h1]:mt-5 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline [&_a]:underline-offset-3 [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:my-3 [&_blockquote]:border-l-3 [&_blockquote]:pl-3.5 [&_blockquote]:text-muted-foreground [&_table]:my-3 [&_table]:block [&_table]:overflow-x-auto [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_img]:max-w-full [&_hr]:my-4 break-words";

export function ResultCard({ page }: { page: PageResult }) {
  const meta = [
    ...new Set(
      [
        page.author,
        page.site,
        page.wordCount ? `약 ${page.wordCount.toLocaleString()}단어` : "",
      ].filter(Boolean)
    ),
  ];
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-2xl leading-snug break-words">
          {page.title || "제목 없음"}
        </CardTitle>
        {meta.length > 0 && (
          <p className="flex flex-wrap gap-x-2.5 text-sm text-muted-foreground">
            {meta.map((m, i) => (
              <span key={m}>
                {i > 0 && <span className="mr-2.5">·</span>}
                {m}
              </span>
            ))}
          </p>
        )}
      </CardHeader>
      <CardContent className="max-h-[28rem] overflow-y-auto">
        <div className={MD_STYLES}>
          <Markdown remarkPlugins={[remarkGfm]}>{page.markdown}</Markdown>
        </div>
      </CardContent>
    </Card>
  );
}
