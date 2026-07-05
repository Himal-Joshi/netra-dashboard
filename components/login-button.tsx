"use client";

import { LogIn } from "lucide-react";
import { signIn } from "next-auth/react";

export function TopLoginButton() {
  return (
    <button 
      onClick={() => signIn("discord")}
      className="bg-transparent border border-[#2d2d2d] text-white font-mono text-xs px-4 py-2 rounded hover:bg-white/5 transition-all active:scale-95 duration-200 uppercase tracking-widest"
    >
      Login
    </button>
  );
}

export function MainLoginButton() {
  return (
    <button 
      onClick={() => signIn("discord")}
      className="bg-[#5865F2] text-white font-mono text-xs md:text-sm px-8 py-3 h-10 rounded-full hover:bg-gradient-to-r hover:from-primary hover:to-blue-400 hover:shadow-[0_0_15px_rgba(88,101,242,0.6)] transition-all active:scale-95 duration-300 inline-flex items-center gap-3 tracking-widest uppercase border border-transparent"
    >
      <LogIn className="w-4 h-4" />
      LOGIN WITH DISCORD
    </button>
  );
}
