"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateAutomodSettings } from "@/app/dashboard/[guild_id]/actions";

export function AutomodSettingsForm({ 
  guildId, 
  initialSettings 
}: { 
  guildId: string;
  initialSettings: any;
}) {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState((initialSettings?.blacklisted_words || []).join(", "));

  async function onSubmit(fd: FormData) {
    setLoading(true);
    
    const submissionData = new FormData();
    submissionData.append("blacklisted_words", words);

    const result = await updateAutomodSettings(guildId, submissionData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Automod settings saved!");
    }
    
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Automod & Word Filter</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter words separated by commas to automatically delete messages containing them.</p>
        
        <form action={onSubmit} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium">Blacklisted Words</label>
            <Textarea 
              className="bg-background/50 font-mono" 
              rows={4}
              placeholder="badword1, badword2, scamlink.com"
              value={words}
              onChange={(e) => setWords(e.target.value)}
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
