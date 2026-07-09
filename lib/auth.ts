import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "identify guilds",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at; // timestamp in seconds
      }

      // If we don't have expiration time (from old sessions), or token is expired, we need to refresh
      const now = Date.now();
      const expiresAtMs = (token.expiresAt as number | undefined) ? (token.expiresAt as number) * 1000 : 0;
      
      if (expiresAtMs > 0 && now < expiresAtMs - 10000) {
        // Token is still valid (with 10s buffer)
        return token;
      }

      // Try to refresh token
      try {
        if (!token.refreshToken) throw new Error("No refresh token");

        const response = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID || "",
            client_secret: process.env.DISCORD_CLIENT_SECRET || "",
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
          }),
        });

        const tokens = await response.json();

        if (!response.ok) throw tokens;

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
          refreshToken: tokens.refresh_token ?? token.refreshToken,
        };
      } catch (error) {
        console.error("Error refreshing Discord token:", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken;
      // @ts-ignore
      session.error = token.error;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
