"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function WelcomeSettingsForm({ guildId }: { guildId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [channels, setChannels] = useState<{id: string, name: string}[]>([]);
  const [formData, setFormData] = useState({
    channel_id: "",
    message: "Welcome to the server, {user}!",
    image_url: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const token = (session as any).accessToken;
        
        // Fetch channels
        const cRes = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/channels`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cRes.ok) setChannels(await cRes.json());

        // Fetch settings
        const sRes = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/welcome-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (sRes.ok) {
          const data = await sRes.json();
          setFormData({
            channel_id: data.channel_id?.toString() || "",
            message: data.message || "Welcome to the server, {user}!",
            image_url: data.image_url || "",
          });
        }
      } catch (e) {
        toast.error("Failed to load welcome settings");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [guildId, session, apiUrl]);

  const handleSave = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const token = (session as any).accessToken;
      const res = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/welcome-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          channel_id: formData.channel_id ? parseInt(formData.channel_id) : null,
          message: formData.message,
          image_url: formData.image_url || null,
        }),
      });

      if (res.ok) {
        toast.success("Welcome settings saved!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (e) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Welcome Messages</h2>
        <p className="text-sm text-muted-foreground mb-6">Automatically send a greeting when a user joins the server.</p>
        
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Welcome Channel</label>
            <Select value={formData.channel_id} onValueChange={(v) => setFormData({...formData, channel_id: v || ""})}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select a channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Disabled)</SelectItem>
                {channels.map(c => (
                  <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message Content</label>
            <p className="text-xs text-muted-foreground mb-1">Use {"{user}"} to ping the new member.</p>
            <Textarea 
              className="bg-background/50 font-mono" 
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Image/Banner URL (Optional)</label>
            <Input 
              type="url" 
              className="bg-background/50" 
              placeholder="https://example.com/image.png" 
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
