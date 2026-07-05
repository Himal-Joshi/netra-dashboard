import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

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
  
  // Filter for Administrator (0x8) or Manage Guild (0x20)
  const manageableGuilds = allGuilds.filter((guild) => {
    const perms = BigInt(guild.permissions);
    const admin = (perms & BigInt(0x8)) === BigInt(0x8);
    const manageGuild = (perms & BigInt(0x20)) === BigInt(0x20);
    return admin || manageGuild;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-white">Your Servers</h1>
        <p className="text-[#a1a1aa] text-lg max-w-xl">Select a server to configure Netra and manage its modules, automoderation, and settings.</p>
      </div>

      {manageableGuilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-border rounded-3xl text-center">
          <h2 className="text-2xl font-semibold mb-2">No Servers Found</h2>
          <p className="text-muted-foreground">You don't have permission to manage any servers. You need Administrator or Manage Server permissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manageableGuilds.map((guild) => (
            <Card key={guild.id} className="group relative overflow-hidden rounded-2xl bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-[#5865F2]/50 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_-5px_rgba(88,101,242,0.3)] flex flex-col h-full">
              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2]/0 via-transparent to-[#5865F2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="flex flex-row items-center gap-5 pb-4 pt-6 relative z-10">
                <Avatar className="h-16 w-16 rounded-2xl border border-white/[0.1] bg-black/50 shadow-inner group-hover:border-[#5865F2]/50 transition-colors">
                  <AvatarImage 
                    src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : ""} 
                    alt={guild.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-transparent text-white/70 font-semibold text-xl">
                    {guild.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors line-clamp-1">
                    {guild.name}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-[#a1a1aa] mt-1 opacity-70">
                    ID: {guild.id}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 relative z-10">
                {/* Future content spacing */}
              </CardContent>
              <CardFooter className="pt-4 pb-6 px-6 relative z-10">
                <Link href={`/dashboard/${guild.id}`} className="w-full">
                  <Button className="w-full bg-white/[0.05] hover:bg-[#5865F2] text-white border border-white/[0.1] hover:border-[#5865F2] transition-all duration-300 rounded-xl font-medium tracking-wide">
                    <Settings className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-500" />
                    Manage Settings
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
