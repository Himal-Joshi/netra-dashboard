"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface DashboardClientProps {
  manageableGuilds: Guild[];
  activeGuilds: Guild[];
  inviteGuilds: Guild[];
  inviteUrl: string;
}

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
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function DashboardClient({ manageableGuilds, activeGuilds, inviteGuilds, inviteUrl }: DashboardClientProps) {
  return (
    <div className="space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-black via-black to-black/40 dark:from-white dark:via-white dark:to-white/40 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Your Servers
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Select a server to configure Netra and manage its modules, automoderation, and settings.
        </p>
      </motion.div>

      {manageableGuilds.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center p-16 bg-card/20 backdrop-blur-2xl border border-white/10 rounded-3xl text-center shadow-2xl"
        >
          <div className="text-6xl mb-6 drop-shadow-md">🔍</div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">No Servers Found</h2>
          <p className="text-muted-foreground text-lg max-w-md">You don't have permission to manage any servers. You need Administrator or Manage Server permissions.</p>
        </motion.div>
      ) : (
        <>
          {activeGuilds.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">Active Servers</h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
              >
                {activeGuilds.map((guild) => (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
                    style={{ transformPerspective: 1000 }}
                    key={guild.id}
                  >
                    <Card className="group relative overflow-hidden rounded-3xl bg-card/70 dark:bg-card/30 backdrop-blur-2xl border-border dark:border-white/10 hover:border-primary/60 transition-colors duration-500 shadow-xl flex flex-col h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <CardHeader className="flex flex-row items-center gap-5 pb-4 pt-8 px-8 relative z-10">
                        <Avatar className="h-16 w-16 rounded-2xl border-2 border-transparent bg-secondary shadow-lg group-hover:border-primary/50 transition-colors duration-500">
                          <AvatarImage src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : ""} alt={guild.name} className="object-cover" />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">{guild.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">{guild.name}</CardTitle>
                          <CardDescription className="text-xs font-mono text-muted-foreground mt-1 opacity-70 tracking-widest">ID: {guild.id}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 relative z-10"></CardContent>
                      <CardFooter className="pt-4 pb-8 px-8 relative z-10">
                        <Link href={`/dashboard/${guild.id}`} className="w-full">
                          <Button className="w-full bg-primary/10 hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 text-primary hover:text-white border border-primary/20 hover:border-transparent transition-all duration-300 rounded-2xl font-bold tracking-widest uppercase text-xs h-12 shadow-sm hover:shadow-[0_0_20px_rgba(88,101,242,0.5)] group/btn">
                            <Settings className="w-4 h-4 mr-3 opacity-70 group-hover/btn:opacity-100 group-hover/btn:rotate-90 transition-all duration-500" />
                            Manage Settings
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {inviteGuilds.length > 0 && (
            <div className="space-y-8 pt-12 border-t border-white/5">
              <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">Add Netra to Server</h2>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000"
              >
                {inviteGuilds.map((guild) => (
                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
                    style={{ transformPerspective: 1000 }}
                    key={guild.id}
                  >
                    <Card className="group relative overflow-hidden rounded-3xl bg-card/50 dark:bg-card/10 backdrop-blur-xl border-border dark:border-white/5 hover:border-border dark:hover:border-white/20 transition-all duration-500 flex flex-col h-full grayscale-[0.5] hover:grayscale-0 shadow-lg hover:bg-card/70 dark:hover:bg-card/20">
                      <CardHeader className="flex flex-row items-center gap-5 pb-4 pt-8 px-8">
                        <Avatar className="h-16 w-16 rounded-2xl border border-white/10 bg-secondary/50 shadow-inner group-hover:border-white/30 transition-colors">
                          <AvatarImage src={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : ""} alt={guild.name} className="object-cover" />
                          <AvatarFallback className="bg-transparent text-foreground/50 font-bold text-2xl">{guild.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-bold tracking-tight text-foreground/70 group-hover:text-foreground line-clamp-1 transition-colors">{guild.name}</CardTitle>
                          <CardDescription className="text-xs font-mono text-muted-foreground mt-1 opacity-50 tracking-widest">ID: {guild.id}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1"></CardContent>
                      <CardFooter className="pt-4 pb-8 px-8">
                        <a href={inviteUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button variant="outline" className="w-full rounded-2xl font-bold tracking-widest uppercase text-xs h-12 border-dashed border-white/20 hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-300">
                            <Plus className="w-4 h-4 mr-3" />
                            Invite Netra
                          </Button>
                        </a>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
