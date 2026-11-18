import { AppShell } from "@/components/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <AppShell title="저장한 글" back={{ href: "/", label: "홈" }}>
      <div aria-busy="true" aria-label="불러오는 중" className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="gap-2">
              <Skeleton className="h-5 w-[65%]" />
              <Skeleton className="h-4 w-[35%]" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
