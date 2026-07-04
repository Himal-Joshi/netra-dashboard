"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function updateTicketSettings(guildId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { error: "Unauthorized" };
  }

  const accessToken = (session as any).accessToken;
  const transcriptChannelId = formData.get("transcript_channel_id") as string;
  const moderatorRoleId = formData.get("moderator_role_id") as string;

  try {
    const res = await fetch(`${API_URL}/api/guilds/${guildId}/ticket-settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transcript_channel_id: transcriptChannelId,
        moderator_role_id: moderatorRoleId,
      }),
    });

    if (!res.ok) {
      return { error: `Failed to update settings: ${res.statusText}` };
    }

    revalidatePath(`/dashboard/${guildId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket settings:", error);
    return { error: "Failed to connect to the server." };
  }
}
