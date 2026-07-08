"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateWelcomeSettings } from "@/app/dashboard/[guild_id]/actions";

export function WelcomeSettingsForm({ 
  guildId, 
  initialSettings, 
  channels 
}: { 
  guildId: string;
  initialSettings: any;
  channels: {id: string, name: string}[];
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    channel_id: initialSettings?.channel_id?.toString() || "",
    message: initialSettings?.message || "Welcome to the server, {user}!",
    image_url: initialSettings?.image_url || "",
  });

  async function onSubmit(fd: FormData) {
    setLoading(true);
    
    // We update the formData with our state values because the Select component doesn't automatically put its value in the native FormData if not set up correctly with hidden inputs.
    // An easier way is to just append them to a new FormData
    const submissionData = new FormData();
    submissionData.append("channel_id", formData.channel_id);
    submissionData.append("message", formData.message);
    submissionData.append("image_url", formData.image_url);

    const result = await updateWelcomeSettings(guildId, submissionData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Welcome settings saved!");
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Welcome Messages</h2>
        <p className="text-sm text-muted-foreground mb-6">Automatically send a greeting when a user joins the server.</p>
        
        <form action={onSubmit} className="space-y-4 max-w-2xl">
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

          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Settings
          </Button>
        </form>
      </div>
    </div>
  );
}
