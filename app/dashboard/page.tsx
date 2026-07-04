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
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Your Servers</h1>
        <p className="text-muted-foreground text-lg">Select a server to manage Netra settings.</p>
      </div>

      {manageableGuilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card/50 border border-border rounded-3xl text-center">
          <h2 className="text-2xl font-semibold mb-2">No Servers Found</h2>
          <p className="text-muted-foreground">You don't have permission to manage any servers. You need Administrator or Manage Server permissions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manageableGuilds.map((guild) => (
            <Card key={guild.id} className="group hover:border-primary/50 transition-colors bg-card/40 backdrop-blur-sm shadow-md hover:shadow-[0_0_20px_rgba(88,101,242,0.15)] flex flex-col h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                  <AvatarImage 
                    src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : ""} 
                    alt={guild.name} 
                  />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                    {guild.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">{guild.name}</CardTitle>
                  <CardDescription>Server ID: {guild.id}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Could display bot presence here if we checked with backend */}
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/${guild.id}`} className="w-full">
                  <Button className="w-full group-hover:bg-primary transition-colors group-hover:text-primary-foreground">
                    <Settings className="w-4 h-4 mr-2" />
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
