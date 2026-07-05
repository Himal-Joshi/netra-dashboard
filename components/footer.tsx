export function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/[0.05] bg-[#050505] mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-6">
        <div className="font-bold text-sm tracking-tighter">Netra</div>
        <div className="flex gap-8">
          <a className="text-[#a1a1aa] hover:text-white transition-colors font-mono text-[10px] tracking-widest uppercase" href="/tos">Terms</a>
          <a className="text-[#a1a1aa] hover:text-white transition-colors font-mono text-[10px] tracking-widest uppercase" href="/privacy">Privacy</a>
        </div>
        <div className="font-mono text-[10px] text-[#a1a1aa] tracking-widest uppercase">
          © 2026 Netra.
        </div>
      </div>
    </footer>
  );
}
