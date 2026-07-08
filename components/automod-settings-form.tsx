"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export function AutomodSettingsForm({ guildId }: { guildId: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [words, setWords] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    async function fetchData() {
      if (!session) return;
      try {
        const token = (session as any).accessToken;
        const res = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/automod-settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWords((data.blacklisted_words || []).join(", "));
        }
      } catch (e) {
        toast.error("Failed to load automod settings");
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
      
      const wordList = words.split(",")
        .map(w => w.trim())
        .filter(w => w.length > 0);

      const res = await fetch(`${apiUrl}/api/v1/guilds/${guildId}/automod-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          blacklisted_words: wordList,
        }),
      });

      if (res.ok) {
        toast.success("Automod settings saved!");
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
        <h2 className="text-xl font-bold mb-2">Automod & Word Filter</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter words separated by commas to automatically delete messages containing them.</p>
        
        <div className="space-y-4 max-w-2xl">
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

          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
