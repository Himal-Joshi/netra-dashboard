import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { TopLoginButton, MainLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
async function getStats() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#0a0a0a] text-[#e2e1eb] font-sans selection:bg-[#5865f2] selection:text-white">
      
      {/* Atmospheric Background Element */}
      <div className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div 
          className="w-[120%] h-[120%] absolute opacity-15 blur-[120px]" 
          style={{
            backgroundImage: "url('/banner.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Minimalist Top Nav */}
        <nav className="w-full top-0 backdrop-blur-xl bg-[#0a0a0a]/30 sticky z-50">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
            <div className="font-bold text-xl tracking-tighter">
              Netra
            </div>
            <div className="hidden md:flex items-center gap-12 font-mono text-xs tracking-widest uppercase">
              <a className="text-[#bec2ff] border-b border-[#bec2ff] pb-1" href="#">Home</a>
              <a className="text-[#a1a1aa] hover:text-white transition-colors" href="#">Commands</a>
              <a className="text-[#a1a1aa] hover:text-white transition-colors" href="#">Support</a>
            </div>
            <TopLoginButton />
          </div>
        </nav>

        {/* Hero Section */}
        <main className="flex-grow flex flex-col items-center justify-center px-6 py-20 lg:py-32">
          <div className="text-center space-y-12 max-w-4xl w-full flex flex-col items-center">
            
            {/* Brand Logo */}
            <div className="flex justify-center mb-4">
              <Image 
                src="/full_logo_with_name.png" 
                alt="Netra Logo" 
                width={400} 
                height={150} 
                className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                priority
              />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-[80px] font-bold tracking-[0.15em] text-white hidden">
                NETRA
              </h1>
              <p className="font-mono text-xs md:text-sm text-[#a1a1aa] tracking-[0.3em] uppercase">
                Intelligence in Silence
              </p>
            </div>

            <div className="pt-8">
              <MainLoginButton />
            </div>
          </div>
        </main>

        {/* Stats Section */}
        <section className="w-full max-w-5xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Stats Card 1 */}
            <div className="group flex flex-col items-start p-6 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-xl transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(88,101,242,0.05),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="flex justify-between items-center w-full mb-8">
                <Image src="/logo_netra.png" alt="Icon" width={24} height={24} className="h-6 w-6 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                <span className="font-mono text-[10px] tracking-widest text-[#5865F2] opacity-70">STABLE</span>
              </div>
              <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{stats?.server_count || "---"}</span>
              <span className="font-mono text-xs text-[#a1a1aa] mt-2 tracking-widest uppercase">Servers</span>
            </div>

            {/* Stats Card 2 */}
            <div className="group flex flex-col items-start p-6 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-xl transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(88,101,242,0.05),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="flex justify-between items-center w-full mb-8">
                <Image src="/logo_netra.png" alt="Icon" width={24} height={24} className="h-6 w-6 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                <span className="font-mono text-[10px] tracking-widest text-[#5865F2] opacity-70">ACTIVE</span>
              </div>
              <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{stats?.member_count || "---"}</span>
              <span className="font-mono text-xs text-[#a1a1aa] mt-2 tracking-widest uppercase">Users</span>
            </div>

            {/* Stats Card 3 */}
            <div className="group flex flex-col items-start p-6 bg-white/[0.02] backdrop-blur-md border border-white/[0.08] rounded-xl transition-transform hover:-translate-y-1 duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(400px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(88,101,242,0.05),transparent_40%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
              <div className="flex justify-between items-center w-full mb-8">
                <Image src="/logo_netra.png" alt="Icon" width={24} height={24} className="h-6 w-6 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-mono text-[10px] tracking-widest text-[#5865F2] opacity-70">99.9%</span>
                </div>
              </div>
              <span className="text-4xl md:text-5xl font-semibold text-white tracking-tight">{stats?.ping ? `${stats.ping}ms` : "---"}</span>
              <span className="font-mono text-xs text-[#a1a1aa] mt-2 tracking-widest uppercase">Ping</span>
            </div>

          </div>
        </section>
        
        <Footer />

      </div>
    </div>
  );
}
