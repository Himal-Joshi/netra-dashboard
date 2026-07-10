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
    const res = await fetch(`${API_URL}/api/v1/guilds/${guildId}/ticket-settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        transcript_channel_id: transcriptChannelId || null,
        moderator_role_id: moderatorRoleId || null,
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

export async function updateAutomodSettings(guildId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  const accessToken = (session as any).accessToken;
  const wordsStr = formData.get("blacklisted_words") as string;
  const wordsList = wordsStr.split(",").map(w => w.trim()).filter(w => w.length > 0);

  const warningMsg = formData.get("warning_message") as string;

  try {
    const res = await fetch(`${API_URL}/api/v1/guilds/${guildId}/automod-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ 
        blacklisted_words: wordsList,
        warning_message: warningMsg || null
      }),
    });
    if (!res.ok) return { error: `Failed to update settings: ${res.statusText}` };
    revalidatePath(`/dashboard/${guildId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to connect to the server." };
  }
}

export async function updateWelcomeSettings(guildId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  const accessToken = (session as any).accessToken;
  
  const channel_id = formData.get("channel_id") as string;
  const message = formData.get("message") as string;
  const image_url = formData.get("image_url") as string;

  try {
    const res = await fetch(`${API_URL}/api/v1/guilds/${guildId}/welcome-settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        channel_id: channel_id || null,
        message: message || null,
        image_url: image_url || null,
      }),
    });
    if (!res.ok) return { error: `Failed to update settings: ${res.statusText}` };
    revalidatePath(`/dashboard/${guildId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to connect to the server." };
  }
}

export async function sendEmbedAction(guildId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) return { error: "Unauthorized" };
  const accessToken = (session as any).accessToken;
  
  const channel_id = formData.get("channel_id") as string;
  const message = formData.get("message") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const color = formData.get("color") as string;
  const image_url = formData.get("image_url") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;

  if (!channel_id) return { error: "Please select a channel" };
  if (!title && !description && !message && !image_url) return { error: "You must provide either a message or embed content" };

  try {
    const res = await fetch(`${API_URL}/api/v1/guilds/${guildId}/send-embed`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        channel_id: channel_id,
        message: message || null,
        title: title || null,
        description: description || null,
        color: color || null,
        image_url: image_url || null,
        thumbnail_url: thumbnail_url || null,
      }),
    });
    if (!res.ok) return { error: `Failed to send embed: ${res.statusText}` };
    return { success: true };
  } catch (error) {
    return { error: "Failed to connect to the server." };
  }
}
