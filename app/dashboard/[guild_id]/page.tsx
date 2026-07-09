import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GuildSettingsClient } from "@/components/guild-settings-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getSettings(guildId: string, accessToken: string, endpoint: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/guilds/${guildId}/${endpoint}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { tags: [`${endpoint}-${guildId}`], revalidate: 10 },
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) return { error: "Unauthorized" };
      return null;
    }
    return await res.json();
  } catch (e) {
    return null;
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
  const sessionError = (session as any).error;

  if (!accessToken || sessionError === "RefreshAccessTokenError") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Session Expired</h2>
        <p className="text-muted-foreground">Your Discord session has expired. Please sign in again to continue.</p>
        <Link href="/api/auth/signin">
          <Button size="lg">Sign In Again</Button>
        </Link>
      </div>
    );
  }

  const { guild_id } = await params;
  
  const [ticketSettings, automodSettings, welcomeSettings, channels] = await Promise.all([
    getSettings(guild_id, accessToken, "ticket-settings"),
    getSettings(guild_id, accessToken, "automod-settings"),
    getSettings(guild_id, accessToken, "welcome-settings"),
    getSettings(guild_id, accessToken, "channels"),
  ]);

  const error = ticketSettings?.error || automodSettings?.error;

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

      {error ? (
        <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
          <h2 className="font-semibold text-lg mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <GuildSettingsClient 
          guildId={guild_id} 
          ticketSettings={ticketSettings || {}} 
          automodSettings={automodSettings || {}} 
          welcomeSettings={welcomeSettings || {}} 
          channels={channels || []} 
        />
      )}
      
      <Toaster theme="dark" />
    </div>
  );
}
