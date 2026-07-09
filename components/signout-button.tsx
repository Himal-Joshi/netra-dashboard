"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full justify-start text-red-500 hover:text-white hover:bg-red-500/80 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] h-14 rounded-2xl transition-all font-semibold tracking-wide text-md"
    >
      <LogOut className="mr-4 h-5 w-5" />
      Sign Out
    </Button>
  );
}
