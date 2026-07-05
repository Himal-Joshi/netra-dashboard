import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ClientLandingPage from "@/components/client-landing-page";

async function getStats() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/stats`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

export default async function Home() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  if (session) {
    redirect("/dashboard");
  }

  return <ClientLandingPage stats={stats} />;
}
