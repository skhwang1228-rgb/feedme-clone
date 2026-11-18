"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CHAT_SERVICES,
  PROMPT_PRESETS,
  composeText,
  toFilename,
  type ChatService,
} from "../export";
import type { ConvertedPage } from "../types";

const NONE = "none";
const CUSTOM = "custom";

export function ExportPanel({ page }: { page: ConvertedPage }) {
  // 직접 입력은 컴포넌트 state에만 둔다(저장하지 않음). 지우기 때 부모가 key를 바꿔 다시 마운트한다.
  const [choice, setChoice] = useState<string>(NONE);
  const [custom, setCustom] = useState("");

  const prompt = choice === NONE ? "" : choice === CUSTOM ? custom : choice;
  const text = composeText(prompt, page.markdown);

  async function copy(): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      toast.error("클립보드에 복사하지 못했습니다. 브라우저 권한을 확인해 주세요.");
      return false;
    }
  }

  async function onCopy() {
    if (await copy()) {
      toast.success(
        prompt.trim() ? "프롬프트와 본문을 복사했습니다" : "본문을 복사했습니다"
      );
    }
  }

  function onDownload() {
    const blob = new Blob([page.markdown], {
      type: "text/markdown;charset=utf-8",
    });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = toFilename(page.title);
    a.href = href;
    a.download = name;
    a.click();
    URL.revokeObjectURL(href);
    toast.success(`${name} 을(를) 내려받았습니다 (본문만 포함)`);
  }

  async function onOpen(service: ChatService) {
    if (!(await copy())) return;
    const { label, url } = CHAT_SERVICES[service];
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(`복사했습니다. 열린 ${label} 입력창에 붙여넣으세요`);
  }

  const options = [
    { value: NONE, label: "프롬프트 없음" },
    ...PROMPT_PRESETS.map((p) => ({ value: p as string, label: p as string })),
    { value: CUSTOM, label: "직접 입력" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          프롬프트{" "}
          <span className="font-normal text-muted-foreground">
            (복사·LLM 열기 때 본문 앞에 붙습니다)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div
          role="radiogroup"
          aria-label="프롬프트 선택"
          className="flex flex-wrap gap-2"
        >
          {options.map((o) => (
            <Button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={choice === o.value}
              size="sm"
              variant={choice === o.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setChoice(o.value)}
            >
              {o.label}
            </Button>
          ))}
        </div>
        {choice === CUSTOM && (
          <div className="flex flex-col gap-1.5">
            <Input
              autoFocus
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="예: 핵심 3줄만 뽑아서 불릿으로 정리해줘"
              aria-label="직접 입력 프롬프트"
            />
            <p className="text-sm text-muted-foreground">
              이번 한 번만 쓰이며 저장되지 않습니다.
            </p>
          </div>
        )}
        <hr className="border-border" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="outline" onClick={onCopy}>
            복사하기
          </Button>
          <Button variant="outline" onClick={onDownload}>
            .md 다운로드
          </Button>
          <Button onClick={() => onOpen("chatgpt")}>ChatGPT로 열기</Button>
          <Button onClick={() => onOpen("claude")}>Claude로 열기</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          열기를 누르면 내용이 클립보드에 복사됩니다. 새 탭의 입력창에 붙여넣으세요.
        </p>
      </CardContent>
    </Card>
  );
}
