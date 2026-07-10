"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { sendEmbedAction } from "@/app/dashboard/[guild_id]/actions";

export function EmbedBuilderForm({ 
  guildId, 
  channels 
}: { 
  guildId: string;
  channels: {id: string, name: string}[];
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    channel_id: "none",
    message: "",
    title: "",
    description: "",
    color: "#5865F2",
    image_url: "",
    thumbnail_url: "",
  });

  async function onSubmit(fd: FormData) {
    if (!formData.channel_id || formData.channel_id === "none") {
      toast.error("Please select a channel");
      return;
    }
    if (!formData.title && !formData.description && !formData.message && !formData.image_url) {
      toast.error("You must provide either a message or embed content");
      return;
    }

    setLoading(true);
    
    const submissionData = new FormData();
    submissionData.append("channel_id", formData.channel_id === "none" ? "" : formData.channel_id);
    submissionData.append("message", formData.message);
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("color", formData.color);
    submissionData.append("image_url", formData.image_url);
    submissionData.append("thumbnail_url", formData.thumbnail_url);

    const result = await sendEmbedAction(guildId, submissionData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Embed sent successfully!");
      setFormData({ ...formData, message: "", title: "", description: "", image_url: "", thumbnail_url: "" }); // Reset content but keep channel/color
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Embed Builder</h2>
        <p className="text-sm text-muted-foreground mb-6">Create and instantly send rich embedded messages to your server.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Channel *</label>
              <Select value={formData.channel_id} onValueChange={(v) => setFormData({...formData, channel_id: v || "none"})}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select a channel</SelectItem>
                  {Array.isArray(channels) ? channels.map(c => (
                    <SelectItem key={c.id} value={c.id}>#{c.name}</SelectItem>
                  )) : null}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Plain Text Message (Optional)</label>
              <Textarea 
                className="bg-background/50" 
                rows={3}
                placeholder="Type a regular message here to appear above the embed, or use it without an embed to send plain text..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail URL</label>
                <Input 
                  type="url" 
                  className="bg-background/50" 
                  placeholder="https://example.com/thumb.png" 
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({...formData, thumbnail_url: e.target.value})}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send to Discord
            </Button>
          </form>

          {/* Embed Preview */}
          <div className="relative">
            <label className="text-sm font-medium text-muted-foreground block mb-2">Live Preview</label>
            <div className="bg-[#313338] text-[#dbdee1] p-4 rounded-md shadow-lg font-sans">
              
              {formData.message && (
                <div className="mb-2 whitespace-pre-wrap leading-relaxed">{formData.message}</div>
              )}

              {(formData.title || formData.description || formData.image_url || formData.thumbnail_url) && (
                <div className="border-l-4 pl-4 mt-2" style={{ borderLeftColor: formData.color }}>
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
                  </div>
                  {formData.thumbnail_url && (
                    <div className="flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.thumbnail_url} alt="Thumbnail" className="w-16 h-16 md:w-20 md:h-20 rounded-md object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                  )}
                </div>
              </div>
              )}

              {!formData.title && !formData.description && !formData.image_url && !formData.thumbnail_url && !formData.message && (
                <div className="text-sm text-gray-500 italic mt-2">Embed preview will appear here...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
