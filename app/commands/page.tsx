"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

const commands = [
  // User Commands
  { name: "/ping", description: "Check the bot's latency", category: "Utility" },
  { name: "/serverinfo", description: "Get information about the server", category: "Utility" },
  { name: "/active-members", description: "Get a list of currently active members in the server", category: "Utility" },
  { name: "/userinfo", description: "Get information about a user", category: "Utility" },
  { name: "/help", description: "Get a list of commands and how to use them", category: "Utility" },
  { name: "/remind", description: "Set a reminder", category: "Utility" },
  { name: "/create-ticket", description: "Create a new support ticket", category: "Support" },
  { name: "/play", description: "Play a song from YouTube or add it to the queue", category: "Music" },
  { name: "/pause", description: "Pause the currently playing song", category: "Music" },
  { name: "/resume", description: "Resume the paused song", category: "Music" },
  { name: "/skip", description: "Skip the current song", category: "Music" },
  { name: "/queue", description: "View the upcoming songs in the queue", category: "Music" },
  { name: "/end", description: "Stop the music, clear the queue, and disconnect", category: "Music" },
  // Admin & Moderator Commands
  { name: "/kick", description: "Kick a member from the server", category: "Moderation" },
  { name: "/ban", description: "Ban a member from the server", category: "Moderation" },
  { name: "/timeout", description: "Timeout a member", category: "Moderation" },
  { name: "/announce", description: "Schedule an announcement in a specific channel", category: "Admin" },
  { name: "/close-ticket", description: "Close the current ticket", category: "Support" },
  { name: "/setup-tickets", description: "Setup a persistent ticket panel in this channel", category: "Admin" },
  { name: "/setticket-moderator", description: "Set the role that is pinged when a ticket is opened", category: "Admin" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function CommandsPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      
      {/* Background Elements */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary opacity-[0.05] blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <div className="relative z-10 flex flex-col flex-grow">
        
        {/* Navigation - Edge to Edge */}
        <nav className="w-full top-0 backdrop-blur-xl bg-background/30 sticky z-50 border-b border-white/5 transition-colors">
          <div className="flex justify-between items-center w-full px-8 md:px-12 lg:px-24 py-5 mx-auto">
            <Link href="/" className="transition-transform hover:scale-105">
              <Image priority src="/name.png" alt="Netra" width={160} height={60} className="h-12 w-auto object-contain filter dark:drop-shadow-none drop-shadow-md" />
            </Link>
            <div className="hidden md:flex items-center gap-16 font-mono text-sm tracking-[0.2em] uppercase font-semibold">
              <Link className="text-muted-foreground hover:text-foreground transition-colors relative group" href="/">
                Home
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
              <Link className="text-primary relative group" href="/commands">
                Commands
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary transform scale-x-100 transition-transform"></span>
              </Link>
              <Link className="text-muted-foreground hover:text-foreground transition-colors relative group" href="/support">
                Support
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a 
                href="https://discord.com/oauth2/authorize?client_id=1522552291327082628" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden sm:block"
              >
                <div className="flex h-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-6 transition-all hover:bg-gradient-to-r hover:from-primary hover:to-blue-400 hover:text-white hover:border-transparent text-primary font-mono font-bold text-xs tracking-widest uppercase cursor-pointer hover:shadow-[0_0_15px_rgba(88,101,242,0.6)]">
                  Invite Netra
                </div>
              </a>
              <MainLoginButton />
            </div>
          </div>
        </nav>

        {/* Header */}
        <main className="flex-grow flex flex-col items-center px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6 max-w-4xl w-full flex flex-col items-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-black/40 dark:from-white dark:via-white dark:to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] pb-2">
              Command Reference
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Everything you need to control Netra. Browse our extensive list of commands to moderate your server, play music, and configure settings.
            </p>
          </motion.div>

          {/* Search/Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-5xl mb-16"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search commands..." 
                className="w-full h-16 pl-16 pr-6 rounded-2xl bg-card/30 backdrop-blur-xl border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground text-lg shadow-lg"
              />
            </div>
          </motion.div>

          {/* Commands Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 perspective-1000"
          >
            {commands.map((cmd) => (
              <motion.div 
                variants={itemVariants}
                whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                key={cmd.name} 
                className="flex flex-col p-8 bg-card/70 dark:bg-card/30 backdrop-blur-2xl border border-border dark:border-white/10 rounded-2xl hover:border-primary/60 transition-colors duration-300 shadow-xl group"
                style={{ transformPerspective: 1000 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-mono text-xl font-bold text-foreground group-hover:text-primary transition-colors drop-shadow-sm">{cmd.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                    {cmd.category}
                  </span>
                </div>
                <p className="text-foreground/80 dark:text-muted-foreground text-sm leading-relaxed">
                  {cmd.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
