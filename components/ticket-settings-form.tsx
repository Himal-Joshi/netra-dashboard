"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTicketSettings } from "@/app/dashboard/[guild_id]/actions";
import { toast } from "sonner";
import { Save } from "lucide-react";

export function TicketSettingsForm({ 
  guildId, 
  initialSettings 
}: { 
  guildId: string;
  initialSettings: any;
}) {
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const result = await updateTicketSettings(guildId, formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Settings updated successfully!");
    }
    
    setLoading(false);
  }

  return (
    <Card className="max-w-2xl bg-card/40 backdrop-blur-sm border-primary/20 shadow-[0_0_30px_rgba(88,101,242,0.1)]">
      <CardHeader>
        <CardTitle>Ticket Settings</CardTitle>
        <CardDescription>
          Configure how Netra handles support tickets in your server.
        </CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="transcript_channel_id">Transcript Channel ID</Label>
            <Input 
              id="transcript_channel_id" 
              name="transcript_channel_id" 
              defaultValue={initialSettings?.transcript_channel_id || ""}
              placeholder="e.g. 123456789012345678" 
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              The ID of the channel where closed ticket transcripts will be sent.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="moderator_role_id">Moderator Role ID</Label>
            <Input 
              id="moderator_role_id" 
              name="moderator_role_id" 
              defaultValue={initialSettings?.moderator_role_id || ""}
              placeholder="e.g. 123456789012345678" 
              className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground">
              The ID of the role allowed to manage and view all tickets.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] transition-all">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Settings
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
