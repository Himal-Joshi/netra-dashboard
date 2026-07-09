import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/signout-button";

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
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground relative">
      
      {/* God-Tier Atmospheric Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary opacity-[0.05] blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />

      {/* Left Sidebar - Glassmorphism */}
      <aside className="w-72 flex-shrink-0 border-r border-border bg-card/30 backdrop-blur-3xl flex flex-col z-20 shadow-xl relative">
        <div className="h-24 flex items-center px-8 border-b border-border/50">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image priority src="/name.png" alt="Netra" width={160} height={60} className="h-12 w-auto object-contain filter dark:drop-shadow-none drop-shadow-md" />
          </Link>
        </div>
        
        <nav className="flex-1 px-6 py-8 space-y-3 overflow-y-auto">
          <Link href="/dashboard" className="block">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-primary/10 h-14 rounded-2xl transition-all font-semibold tracking-wide text-md">
              <LayoutDashboard className="mr-4 h-5 w-5" />
              Overview
            </Button>
          </Link>
          <div className="pt-6 pb-2">
            <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Account Settings</p>
          </div>
          <SignOutButton />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto z-10 relative scroll-smooth">
        <div className="p-8 md:p-14 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
