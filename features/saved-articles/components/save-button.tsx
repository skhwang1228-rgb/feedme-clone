"use client";

import { CheckIcon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { saveArticle } from "../actions";
import { stashPending } from "../pending";
import type { ArticleDraft } from "../types";

type Status = "idle" | "saving" | "saved";

export const RESUME_NEXT = "/?resume=save";

export function SaveButton({
  draft,
  autoSave = false,
}: {
  draft: ArticleDraft;
  autoSave?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [failed, setFailed] = useState(false);
  const busy = useRef(false); // 연속 클릭과 StrictMode 이중 실행 방지
  const done = useRef(false);

  async function save() {
    if (busy.current || done.current) return;
    busy.current = true;
    setStatus("saving");
    setFailed(false);
    try {
      const result = await saveArticle(draft);
      if (result.status === "unauthenticated") {
        stashPending(draft);
        router.push(`/auth/login?next=${encodeURIComponent(RESUME_NEXT)}`);
        return;
      }
      if (result.status === "error") {
        setStatus("idle");
        setFailed(true);
        toast.error(result.message);
        return;
      }
      done.current = true;
      setStatus("saved");
      toast.success("저장했습니다. 저장한 글 목록에서 볼 수 있습니다");
    } catch {
      setStatus("idle");
      setFailed(true);
      toast.error("저장하지 못했습니다. 네트워크를 확인하고 다시 시도해 주세요.");
    } finally {
      busy.current = false;
    }
  }

  useEffect(() => {
    // 마운트 때 한 번만 자동 저장한다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (autoSave) void save();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={save}
        disabled={status !== "idle"}
        variant={status === "saved" ? "secondary" : "default"}
      >
        {status === "saved" ? <CheckIcon /> : <SaveIcon />}
        {status === "saving" ? "저장 중…" : status === "saved" ? "저장됨" : "저장"}
      </Button>
      {failed && (
        <p role="alert" className="text-sm text-destructive">
          저장에 실패했습니다. 다시 저장해 보세요.
        </p>
      )}
    </div>
  );
}
