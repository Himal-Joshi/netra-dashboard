import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
import { Search } from "lucide-react";

export const metadata = {
  title: "Commands - Netra Dashboard",
  description: "Explore all available commands for the Netra Discord Bot.",
};

const commands = [
  { name: "/help", description: "Displays a list of all commands or info about a specific command.", category: "Utility" },
  { name: "/ping", description: "Checks the bot's latency to the Discord servers.", category: "Utility" },
  { name: "/ban", description: "Bans a member from the server.", category: "Moderation" },
  { name: "/kick", description: "Kicks a member from the server.", category: "Moderation" },
  { name: "/mute", description: "Temporarily mutes a member so they cannot send messages.", category: "Moderation" },
  { name: "/play", description: "Plays a song from YouTube, Spotify, or Soundcloud.", category: "Music" },
  { name: "/skip", description: "Skips the currently playing song.", category: "Music" },
  { name: "/config", description: "Configure server-specific settings for the bot.", category: "Admin" },
];

export default function CommandsPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Background Element */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary opacity-[0.05] blur-[150px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Navigation */}
        <nav className="w-full top-0 backdrop-blur-xl bg-background/50 sticky z-50 border-b border-border">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
            <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors">
              Netra
            </Link>
            <div className="hidden md:flex items-center gap-12 font-mono text-xs tracking-widest uppercase">
              <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/">Home</Link>
              <Link className="text-primary border-b border-primary pb-1" href="/commands">Commands</Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/support">Support</Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <TopLoginButton />
            </div>
          </div>
        </nav>

        {/* Header */}
        <main className="flex-grow flex flex-col items-center px-6 py-20">
          <div className="text-center space-y-6 max-w-4xl w-full flex flex-col items-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Command Reference
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Everything you need to control Netra. Browse our extensive list of commands to moderate your server, play music, and configure settings.
            </p>
          </div>

          {/* Search/Filter Bar (Visual Only for now) */}
          <div className="w-full max-w-5xl mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-foreground"
              />
            </div>
          </div>

          {/* Commands Grid */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {commands.map((cmd) => (
              <div key={cmd.name} className="flex flex-col p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-mono text-lg font-bold text-primary">{cmd.name}</h3>
                  <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {cmd.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {cmd.description}
                </p>
              </div>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
