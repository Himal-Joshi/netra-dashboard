"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TicketSettingsForm } from "./ticket-settings-form";
import { WelcomeSettingsForm } from "./welcome-settings-form";
import { AutomodSettingsForm } from "./automod-settings-form";
import { EmbedBuilderForm } from "./embed-builder-form";

export function GuildSettingsClient({
  guildId,
  ticketSettings,
}: {
  guildId: string;
  ticketSettings: any;
}) {
  return (
    <div className="mt-6">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="mb-8 p-1 bg-card/50 backdrop-blur-md border border-border/50 rounded-xl inline-flex h-12 items-center justify-center space-x-1 text-muted-foreground w-full md:w-auto overflow-x-auto">
          <TabsTrigger value="tickets" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">Tickets</TabsTrigger>
          <TabsTrigger value="welcome" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">Welcome</TabsTrigger>
          <TabsTrigger value="automod" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">Automod</TabsTrigger>
          <TabsTrigger value="embed" className="rounded-lg px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none transition-all">Embed Builder</TabsTrigger>
        </TabsList>

        <div className="bg-card/30 backdrop-blur-3xl border border-border/50 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />
          
          <TabsContent value="tickets" className="mt-0 outline-none">
            <TicketSettingsForm guildId={guildId} initialSettings={ticketSettings} />
          </TabsContent>
          <TabsContent value="welcome" className="mt-0 outline-none">
            <WelcomeSettingsForm guildId={guildId} />
          </TabsContent>
          <TabsContent value="automod" className="mt-0 outline-none">
            <AutomodSettingsForm guildId={guildId} />
          </TabsContent>
          <TabsContent value="embed" className="mt-0 outline-none">
            <EmbedBuilderForm guildId={guildId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
