import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login?next=/settings");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>설정</CardTitle>
            <CardDescription>{String(data.claims.email ?? "")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ProfileForm displayName={profile?.display_name ?? ""} />
            <LogoutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
