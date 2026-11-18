export const PROMPT_PRESETS = [
  "요약해줘",
  "한국어로 번역해줘",
  "쉽게 설명해줘",
] as const;

/** 프롬프트가 있으면 빈 줄 하나로 구분해 본문 앞에 붙인다. */
export function composeText(prompt: string, markdown: string): string {
  const p = prompt.trim();
  return p ? `${p}\n\n${markdown}` : markdown;
}

/** 페이지 제목으로 파일명을 만든다. 파일명에 쓸 수 없는 문자는 제거한다. */
export function toFilename(title: string): string {
  const base = title
    .replace(/[\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .trim();
  return `${base || "page"}.md`;
}

export const CHAT_SERVICES = {
  chatgpt: { label: "ChatGPT", url: "https://chatgpt.com/" },
  claude: { label: "Claude", url: "https://claude.ai/new" },
} as const;

export type ChatService = keyof typeof CHAT_SERVICES;
