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
      className="bg-[#5865F2] text-white font-mono text-xs md:text-sm px-10 py-4 rounded hover:brightness-110 transition-all active:scale-95 duration-200 inline-flex items-center gap-3 shadow-[0_4px_20px_rgba(88,101,242,0.3)] tracking-widest uppercase"
    >
      <LogIn className="w-4 h-4" />
      LOGIN WITH DISCORD
    </button>
  );
}
