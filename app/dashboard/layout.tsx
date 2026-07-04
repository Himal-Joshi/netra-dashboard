import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bot, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">Netra Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search or other top nav items here */}
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="destructive" size="sm">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
