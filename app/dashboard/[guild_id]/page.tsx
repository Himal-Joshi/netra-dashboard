import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TicketSettingsForm } from "@/components/ticket-settings-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getTicketSettings(guildId: string, accessToken: string) {
  try {
    const res = await fetch(`${API_URL}/api/guilds/${guildId}/ticket-settings`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { tags: [`ticket-settings-${guildId}`], revalidate: 60 },
    });
    
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        return { error: "You don't have permission to manage this server." };
      }
      return { error: `Failed to fetch settings: ${res.statusText}` };
    }
    
    return { data: await res.json() };
  } catch (e) {
    console.error("Failed to fetch ticket settings", e);
    return { error: "Could not connect to the backend server." };
  }
}

export default async function ServerSettingsPage({
  params,
}: {
  params: Promise<{ guild_id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const accessToken = (session as any).accessToken;
  const { guild_id } = await params;
  
  const result = await getTicketSettings(guild_id, accessToken);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server Settings</h1>
          <p className="text-muted-foreground">Manage Netra configuration for this server.</p>
        </div>
      </div>

      {result.error ? (
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
          <h2 className="font-semibold text-lg mb-2">Error</h2>
          <p>{result.error}</p>
        </div>
      ) : (
        <TicketSettingsForm guildId={guild_id} initialSettings={result.data} />
      )}
      
      <Toaster theme="dark" />
    </div>
  );
}
