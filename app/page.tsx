import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { HomeConverter } from "./home-converter";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);

  return (
    <HomeConverter
      headerAction={
        <Link
          href={signedIn ? "/saved" : "/auth/login?next=/saved"}
          className={buttonVariants({ variant: "outline" })}
        >
          {signedIn ? "저장한 글" : "로그인"}
        </Link>
      }
    />
  );
}
