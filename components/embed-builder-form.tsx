"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Loader2, Send } from "lucide-react";

export function EmbedBuilderForm({ guildId }: { guildId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [channels, setChannels] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    channel_id: "",
    title: "",
    description: "",
    color: "#5865F2",
    image_url: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const token = (session as any).accessToken;
        const cRes = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/channels`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cRes.ok) setChannels(await cRes.json());
      } catch (e) {
        toast.error("Failed to load channels");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [guildId, session, apiUrl]);

  const handleSend = async () => {
    if (!session) return;
    if (!formData.channel_id) {
      toast.error("Please select a channel");
      return;
    }
    if (!formData.title && !formData.description) {
      toast.error("Embed must have a title or description");
      return;
    }

    setSending(true);
    try {
      const token = (session as any).accessToken;
      const res = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/send-embed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel_id: parseInt(formData.channel_id),
          title: formData.title || null,
          description: formData.description || null,
          color: formData.color || null,
          image_url: formData.image_url || null,
        }),
      });

      if (res.ok) {
        toast.success("Embed sent successfully!");
        setFormData({ ...formData, title: "", description: "", image_url: "" }); // Reset content but keep channel/color
      } else {
        toast.error("Failed to send embed");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Embed Builder</h2>
        <p className="text-sm text-muted-foreground mb-6">Create and instantly send rich embedded messages to your server.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Channel *</label>
              <Select value={formData.channel_id} onValueChange={(v) => setFormData({...formData, channel_id: v || ""})}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map(c => (
                    <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Embed Title</label>
              <Input 
                className="bg-background/50" 
                placeholder="Announcement!" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                className="bg-background/50" 
                rows={6}
                placeholder="Write your message here..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color (Hex)</label>
                <div className="flex gap-2">
                  <Input 
                    type="color" 
                    className="w-12 h-10 p-1 bg-background/50" 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                  <Input 
                    className="flex-1 bg-background/50 font-mono" 
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input 
                type="url" 
                className="bg-background/50" 
                placeholder="https://example.com/image.png" 
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>

            <Button onClick={handleSend} disabled={sending} className="w-full">
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send to Discord
            </Button>
          </div>

          {/* Embed Preview */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground block mb-2">Live Preview</label>
            <div className="bg-[#313338] text-[#dbdee1] p-4 rounded-md shadow-lg border-l-4 font-sans" style={{ borderLeftColor: formData.color }}>
              <div className="flex gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  {formData.title && (
                    <div className="font-bold text-white text-base truncate">{formData.title}</div>
                  )}
                  {formData.description && (
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{formData.description}</div>
                  )}
                  {formData.image_url && (
                    <div className="mt-4 rounded-md overflow-hidden max-w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.image_url} alt="Embed image" className="max-h-64 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                  )}
                  {!formData.title && !formData.description && !formData.image_url && (
                    <div className="text-sm text-gray-500 italic">Embed preview will appear here...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
