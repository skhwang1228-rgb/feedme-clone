import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

// 홈 이외 화면의 공통 shell: content width, gutter, section 간격, 뒤로 가기 위치를 관리한다.
export function AppShell({
  title,
  back,
  children,
}: {
  title: string;
  back?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col items-start gap-3">
        {back && (
          <Link
            href={back.href}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowLeftIcon />
            {back.label}
          </Link>
        )}
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
      </header>
      {children}
    </main>
  );
}
