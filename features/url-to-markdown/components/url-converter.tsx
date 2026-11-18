"use client";

import { SearchIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConvertedPage } from "../types";
import { parseWebUrl } from "../validate-url";
import { ExportPanel } from "./export-panel";
import { ResultCard } from "./result-card";
import { ThemeToggle } from "./theme-toggle";

const INVALID_URL = "http:// 또는 https://로 시작하는 올바른 URL을 입력하세요.";

const BUBBLES = [
  { left: "6%", bottom: 30, size: 16 },
  { left: "14%", bottom: 10, size: 30, dim: true },
  { left: "26%", bottom: 48, size: 22, dim: true },
  { left: "34%", bottom: 6, size: 12 },
  { left: "46%", bottom: -8, size: 34 },
  { left: "58%", bottom: 34, size: 26, dim: true },
  { left: "68%", bottom: 8, size: 44 },
  { left: "80%", bottom: 40, size: 18, dim: true },
  { left: "90%", bottom: 20, size: 14 },
];

export function UrlConverter() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState<ConvertedPage | null>(null);
  const [session, setSession] = useState(0); // 새 결과/지우기마다 내보내기 패널을 초기화
  const inFlight = useRef<AbortController | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setFetchError(null);
    setPage(null);
    const url = parseWebUrl(input);
    if (!url) {
      setUrlError(INVALID_URL);
      return;
    }
    setUrlError(null);
    setLoading(true);
    const ctrl = new AbortController();
    inFlight.current = ctrl;
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
        signal: ctrl.signal,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "변환에 실패했습니다.");
      setPage(data);
      setSession((n) => n + 1);
    } catch (err) {
      if (ctrl.signal.aborted) return;
      setFetchError(err instanceof Error ? err.message : "변환에 실패했습니다.");
    } finally {
      if (inFlight.current === ctrl) {
        inFlight.current = null;
        setLoading(false);
      }
    }
  }

  function onClear() {
    inFlight.current?.abort();
    inFlight.current = null;
    setLoading(false);
    setInput("");
    setUrlError(null);
    setFetchError(null);
    setPage(null);
    setSession((n) => n + 1);
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pb-12 sm:px-6">
      <header className="relative isolate flex flex-col items-center gap-7 px-2 pt-14 pb-16 text-center">
        <div
          aria-hidden
          className="absolute inset-x-[-1rem] top-[-2.5rem] bottom-0 -z-20 bg-[radial-gradient(ellipse_60%_70%_at_50%_0%,color-mix(in_oklch,var(--primary)_20%,transparent),transparent_70%)]"
        />
        <ThemeToggle className="absolute top-3 right-0" />
        <div className="flex flex-col gap-2.5">
          <h1 className="font-heading text-[clamp(1.75rem,6vw,2.75rem)] leading-tight font-semibold tracking-tight">
            <span className="text-primary">URL</span>{" "}
            <span className="text-muted-foreground">→ Markdown</span>
          </h1>
          <p className="text-muted-foreground">
            웹 페이지 본문을 Markdown으로 바꿔 LLM에 바로 넘깁니다.
          </p>
        </div>
        <form onSubmit={onSubmit} noValidate className="w-full max-w-xl text-left">
          <div className="flex items-center gap-2 rounded-2xl border border-input bg-foreground/5 py-1.5 pr-1.5 pl-3.5 backdrop-blur focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/25">
            <SearchIcon
              className="size-[18px] shrink-0 text-muted-foreground"
              aria-hidden
            />
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setUrlError(null);
              }}
              inputMode="url"
              autoComplete="off"
              placeholder="https://example.com/article"
              aria-label="웹 페이지 URL"
              aria-invalid={urlError ? true : undefined}
              className="h-10 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            {input && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="지우기"
                onClick={onClear}
              >
                <XIcon />
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              className="h-10 rounded-xl"
              disabled={loading}
            >
              {loading ? "변환 중…" : "변환"}
            </Button>
          </div>
          {urlError ? (
            <p className="mt-1.5 text-sm text-destructive">{urlError}</p>
          ) : (
            !loading &&
            !page &&
            !fetchError && (
              <p className="mt-1.5 text-sm text-muted-foreground">
                예: https://en.wikipedia.org/wiki/Markdown
              </p>
            )
          )}
        </form>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[90px]"
        >
          {BUBBLES.map((b) => (
            <i
              key={b.left}
              className={
                b.dim
                  ? "absolute rounded-full bg-muted-foreground/25"
                  : "absolute rounded-full bg-primary/85"
              }
              style={{
                left: b.left,
                bottom: b.bottom,
                width: b.size,
                height: b.size,
              }}
            />
          ))}
        </div>
      </header>

      {fetchError && (
        <Alert variant="destructive">
          <TriangleAlertIcon />
          <AlertTitle>페이지를 가져오지 못했습니다</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card aria-busy="true" aria-label="변환 중">
          <CardHeader className="gap-3 border-b">
            <Skeleton className="h-7 w-[70%]" />
            <Skeleton className="h-4 w-[35%]" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 pt-4">
            <Skeleton className="h-3.5" />
            <Skeleton className="h-3.5 w-[92%]" />
            <Skeleton className="h-3.5 w-[80%]" />
            <Skeleton className="h-3.5 w-[88%]" />
          </CardContent>
        </Card>
      )}

      {page && (
        <>
          <ResultCard page={page} />
          <ExportPanel key={session} page={page} />
        </>
      )}
    </main>
  );
}
