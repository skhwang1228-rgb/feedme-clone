import { Defuddle } from "defuddle/node";
import { parseHTML } from "linkedom";

import type { ConvertedPage } from "./types";

export class ConvertError extends Error {}

const USER_AGENT =
  "Mozilla/5.0 (compatible; UrlToMarkdown/1.0; +https://example.com/bot)";

/** 이미 가져온 HTML을 본문 Markdown과 메타데이터로 바꾼다. */
export async function convertHtml(
  html: string,
  url: string
): Promise<ConvertedPage> {
  const { document } = parseHTML(html);
  const result = await Defuddle(document as unknown as Document, url, {
    markdown: true,
  });
  const markdown = (result.content ?? "").trim();
  if (!markdown) {
    throw new ConvertError("페이지에서 본문을 찾지 못했습니다.");
  }
  return {
    title: (result.title ?? "").trim(),
    author: (result.author ?? "").trim(),
    site: (result.site ?? "").trim(),
    wordCount: result.wordCount ?? 0,
    markdown,
    url,
  };
}

/** URL의 페이지를 서버에서 가져와 Markdown으로 변환한다. */
export async function fetchAndConvert(url: string): Promise<ConvertedPage> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "ko,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new ConvertError("페이지에 연결하지 못했습니다. 주소를 확인해 주세요.");
  }
  if (!res.ok) {
    throw new ConvertError(
      `페이지를 가져오지 못했습니다(HTTP ${res.status}). 사이트가 요청을 막았을 수 있습니다.`
    );
  }
  const type = res.headers.get("content-type") ?? "";
  if (!/html/i.test(type)) {
    throw new ConvertError("HTML 웹 페이지만 변환할 수 있습니다.");
  }
  const html = await res.text();
  try {
    return await convertHtml(html, res.url || url);
  } catch (e) {
    if (e instanceof ConvertError) throw e;
    throw new ConvertError("페이지에서 본문을 추출하지 못했습니다.");
  }
}
