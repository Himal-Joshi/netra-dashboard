export function Footer() {
  return (
    <footer className="w-full py-16 border-t border-border bg-background mt-auto">
      <div className="px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="font-bold text-2xl tracking-tighter text-foreground">Netra</div>
          <p className="text-muted-foreground text-sm">
            Intelligence in Silence. The modern, powerful Discord bot to elevate your server management.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-16 flex-wrap">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-primary uppercase font-bold">Product</span>
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Home</a>
            <a href="/commands" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Commands</a>
            <a href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Dashboard</a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-primary uppercase font-bold">Support</span>
            <a href="/support" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Help Center</a>
            <a href="https://discord.gg/your-invite-link" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Discord Server</a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="font-mono text-xs tracking-widest text-primary uppercase font-bold">Legal</span>
            <a href="/tos" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a>
            <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex justify-between items-center">
        <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">
          © 2026 Netra.
        </div>
      </div>
    </footer>
  );
}
