import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashboardClient from "./client-page";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

async function getUserGuilds(accessToken: string): Promise<Guild[]> {
  try {
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error("Failed to fetch guilds", e);
    return [];
  }
}

async function getBotGuilds(): Promise<string[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/guilds/bot-guilds`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    console.error("Failed to fetch bot guilds", e);
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const accessToken = (session as any).accessToken;
  if (!accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
        <p className="text-muted-foreground mb-4">We couldn't retrieve your Discord access token. Please sign in again.</p>
        <Link href="/api/auth/signin">
          <Button>Sign In Again</Button>
        </Link>
      </div>
    );
  }

  const allGuilds = await getUserGuilds(accessToken);
  const botGuildIds = await getBotGuilds();
  
  // Filter for Administrator (0x8) or Manage Guild (0x20)
  const manageableGuilds = allGuilds.filter((guild) => {
    const perms = BigInt(guild.permissions);
    const admin = (perms & BigInt(0x8)) === BigInt(0x8);
    const manageGuild = (perms & BigInt(0x20)) === BigInt(0x20);
    return admin || manageGuild;
  });

  const activeGuilds = manageableGuilds.filter(g => botGuildIds.includes(g.id));
  const inviteGuilds = manageableGuilds.filter(g => !botGuildIds.includes(g.id));

  const inviteUrl = "https://discord.com/oauth2/authorize?client_id=1522552291327082628";

  return (
    <DashboardClient 
      manageableGuilds={manageableGuilds}
      activeGuilds={activeGuilds}
      inviteGuilds={inviteGuilds}
      inviteUrl={inviteUrl}
    />
  );
}
