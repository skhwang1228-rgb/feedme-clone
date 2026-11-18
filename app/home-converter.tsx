"use client";

import { UrlConverter } from "@/features/url-to-markdown/components/url-converter";
import { SaveButton } from "@/features/saved-articles/components/save-button";
import { takePending } from "@/features/saved-articles/pending";
import type { ReactNode } from "react";

// 변환 기능과 저장 기능은 서로 모른다. 홈 화면(상위)에서 둘을 조합한다.
export function HomeConverter({ headerAction }: { headerAction: ReactNode }) {
  return (
    <UrlConverter
      headerAction={headerAction}
      takeResumed={takePending}
      resultAction={(page, autoRun) => (
        <SaveButton draft={page} autoSave={autoRun} />
      )}
    />
  );
}
