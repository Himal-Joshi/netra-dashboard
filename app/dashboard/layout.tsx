import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard, Settings } from "lucide-react";
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
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Atmospheric Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary opacity-[0.05] blur-[150px] rounded-full pointer-events-none z-0" />
      
      {/* Left Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col z-20 shadow-sm relative">
        <div className="h-20 flex items-center px-6 border-b border-border/50">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <Image 
              src="/logo_netra.png" 
              alt="Netra Logo" 
              width={32} 
              height={32} 
              className="w-auto h-auto group-hover:scale-110 transition-transform dark:invert" 
            />
            <span className="font-bold text-xl tracking-tight">Netra</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="block">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary/50 h-12 rounded-xl transition-all font-medium">
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Overview
            </Button>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
          </div>
          <Link href="/api/auth/signout" className="block">
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-xl transition-all font-medium">
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto z-10 relative scroll-smooth">
        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
