import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopLoginButton } from "@/components/login-button";
import { Footer } from "@/components/footer";
import { MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Support - Netra Dashboard",
  description: "Get help and support for the Netra Discord Bot.",
};

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

export default function SupportPage() {
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
              <Link className="text-muted-foreground hover:text-foreground transition-colors" href="/commands">Commands</Link>
              <Link className="text-primary border-b border-primary pb-1" href="/support">Support</Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <TopLoginButton />
            </div>
          </div>
        </nav>

        {/* Header */}
        <main className="flex-grow flex flex-col items-center px-6 py-20">
          <div className="text-center space-y-6 max-w-3xl w-full flex flex-col items-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Help & Support
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Need assistance? We're here to help. Check our frequently asked questions below or join our Discord community for real-time support.
            </p>
            
            <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="mt-4 gap-2 font-semibold">
                <MessageSquare className="w-5 h-5" />
                Join Support Server
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </Button>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="w-full max-w-3xl space-y-8 pb-20">
            <h2 className="text-2xl font-bold border-b border-border pb-4 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="flex flex-col p-6 bg-card border border-border rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
