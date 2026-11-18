import { describe, expect, it } from "vitest";

import { convertHtml } from "./convert.server";
import { composeText, toFilename } from "./export";
import { parseWebUrl } from "./validate-url";

describe("parseWebUrl", () => {
  it("http/https URL만 통과시킨다", () => {
    expect(parseWebUrl(" https://example.com/a ")).toBe("https://example.com/a");
    expect(parseWebUrl("ftp://example.com")).toBeNull();
    expect(parseWebUrl("example.com")).toBeNull();
    expect(parseWebUrl("")).toBeNull();
  });
});

describe("composeText", () => {
  it("프롬프트와 본문을 빈 줄 하나로 잇고, 프롬프트가 없으면 본문만 돌려준다", () => {
    expect(composeText("요약해줘", "# 본문")).toBe("요약해줘\n\n# 본문");
    expect(composeText("  ", "# 본문")).toBe("# 본문");
  });
});

describe("toFilename", () => {
  it("제목에서 파일명을 만들고 금지 문자를 제거한다", () => {
    expect(toFilename('A/B: "C"?')).toBe("AB C.md");
    expect(toFilename("")).toBe("page.md");
  });
});

describe("convertHtml", () => {
  const body = "<p>" + "본문 문장입니다. ".repeat(40) + "</p>";

  it("제목·저자·Markdown 본문을 추출한다", async () => {
    const html = `<html><head><title>테스트 글</title>
      <meta name="author" content="홍길동"></head>
      <body><article><h1>테스트 글</h1>${body}</article></body></html>`;
    const page = await convertHtml(html, "https://example.com/post");
    expect(page.title).toBe("테스트 글");
    expect(page.author).toBe("홍길동");
    expect(page.markdown).toContain("본문 문장입니다");
  });

  it("저자가 없으면 빈 문자열을 돌려준다", async () => {
    const html = `<html><head><title>무명</title></head>
      <body><article>${body}</article></body></html>`;
    const page = await convertHtml(html, "https://example.com/x");
    expect(page.author).toBe("");
  });

  it("본문이 없으면 오류를 던진다", async () => {
    await expect(
      convertHtml("<html><body></body></html>", "https://example.com/e")
    ).rejects.toThrow();
  });
});
