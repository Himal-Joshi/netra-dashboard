"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { MainLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I invite Netra to my server?",
    answer: "You can invite Netra by clicking the 'Login' button on the homepage, accessing your dashboard, and clicking the invite link. You need 'Manage Server' permissions to add the bot."
  },
  {
    question: "Why is the dashboard not showing my servers?",
    answer: "The dashboard only displays servers where you have 'Administrator' or 'Manage Server' permissions. If you still don't see a server you own, try logging out and logging back in."
  },
  {
    question: "Is Netra free to use?",
    answer: "Yes! Netra is completely free to use with all of its core features."
  },
  {
    question: "How do I report a bug or request a feature?",
    answer: "The best way to reach us is by joining our Official Support Discord Server. We have dedicated channels for bug reports and feature requests."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function SupportPage() {
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
              <Link className="text-muted-foreground hover:text-foreground transition-colors relative group" href="/commands">
                Commands
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-foreground transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </Link>
              <Link className="text-primary relative group" href="/support">
                Support
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-primary transform scale-x-100 transition-transform"></span>
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
              Help & Support
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
              Need assistance? We're here to help. Check our frequently asked questions below or join our Discord community for real-time support.
            </p>
            
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://discord.gg/your-invite-link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-block"
            >
              <Button className="bg-primary/10 hover:bg-gradient-to-r hover:from-primary hover:to-blue-500 text-primary hover:text-white border border-primary/20 hover:border-transparent transition-all duration-300 rounded-full font-bold tracking-widest uppercase text-xs h-14 px-8 shadow-sm hover:shadow-[0_0_20px_rgba(88,101,242,0.5)] group">
                <MessageSquare className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                Join Support Server
                <ExternalLink className="w-4 h-4 ml-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
            </motion.a>
          </motion.div>

          {/* FAQ Section */}
          <div className="w-full max-w-4xl space-y-8 pb-20">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl font-bold border-b border-white/10 pb-4 mb-12 text-center"
            >
              Frequently Asked Questions
            </motion.h2>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6 perspective-1000"
            >
              {faqs.map((faq, index) => (
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  key={index} 
                  className="flex flex-col p-8 bg-card/70 dark:bg-card/30 backdrop-blur-2xl border border-border dark:border-white/10 rounded-2xl shadow-xl hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-bold text-xl mb-3 text-foreground">{faq.question}</h3>
                  <p className="text-foreground/80 dark:text-muted-foreground leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
