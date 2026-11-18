"use client";

import { TriangleAlertIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function SavedError({ reset }: { reset: () => void }) {
  return (
    <AppShell title="저장한 글" back={{ href: "/", label: "홈" }}>
      <Alert variant="destructive">
        <TriangleAlertIcon />
        <AlertTitle>저장한 글을 불러오지 못했습니다</AlertTitle>
        <AlertDescription>잠시 후 다시 시도해 주세요.</AlertDescription>
      </Alert>
      <div>
        <Button variant="outline" onClick={reset}>
          다시 시도
        </Button>
      </div>
    </AppShell>
  );
}
