# Netra Dashboard

Netra Dashboard is the modern web interface for the Netra Discord Bot. It displays live statistics directly from the bot and allows users to manage their servers and configurations through an elegant, atmospheric UI.

## Features

- **Live Statistics**: Displays real-time server count, active users, and bot ping.
- **Discord Authentication**: Seamless login via Discord OAuth2.
- **Modern UI**: Built with Next.js 14, Tailwind CSS, and a sleek dark mode design.
- **Responsive**: Fully responsive interface that looks great on mobile, tablet, and desktop.

## Prerequisites

- Node.js 18+
- A Discord Developer Application (for OAuth2)
- The [Netra Discord Bot](https://github.com/Himal-Joshi/netra-discord-bot) running with its FastAPI backend accessible.

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Himal-Joshi/netra-dashboard.git
   cd netra-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root of the project with the following:
   ```env
   # Discord OAuth Credentials
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret

   # NextAuth Configuration
   NEXTAUTH_SECRET=your_random_secret_string
   NEXTAUTH_URL=http://localhost:3000

   # Backend API Configuration
   # Ensure your bot's FastAPI backend is running and the port is exposed
   NEXT_PUBLIC_API_URL=http://your_bot_server_ip:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

The easiest way to deploy this dashboard is using [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Add all your `.env` variables to the Vercel Environment Variables section.
4. **Important**: Change `NEXTAUTH_URL` to your new Vercel domain (e.g., `https://netra-dashboard.vercel.app`).
5. **Discord Setup**: In the Discord Developer Portal, add your Vercel domain to your OAuth2 Redirect URIs:
   `https://netra-dashboard.vercel.app/api/auth/callback/discord`
6. Click Deploy!
