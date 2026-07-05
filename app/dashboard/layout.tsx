import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bot, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

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
    <div className="flex flex-col min-h-screen relative bg-[#0a0a0a] text-[#e2e1eb] font-sans selection:bg-[#5865f2] selection:text-white overflow-x-hidden">
      {/* Atmospheric Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#5865F2] opacity-[0.08] blur-[150px] rounded-full pointer-events-none -z-10" />
      
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
          <div className="mr-4 hidden md:flex">
            <Link href="/dashboard" className="mr-6 flex items-center space-x-2 group">
              <Bot className="h-6 w-6 text-[#5865F2] group-hover:scale-110 transition-transform" />
              <span className="hidden font-bold sm:inline-block text-white">Netra</span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search or other top nav items here */}
            </div>
            <nav className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden md:flex text-[#a1a1aa] hover:text-white hover:bg-white/[0.05]">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/api/auth/signout">
                <Button variant="outline" size="sm" className="bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8 md:pt-12 mb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
