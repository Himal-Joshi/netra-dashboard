export default function TOSPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-6 space-y-8">
      <h1 className="text-4xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
          <p>By inviting Netra to your Discord server or using our dashboard, you agree to these Terms of Service. If you disagree with any part of the terms, you may not use our services.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
          <p>Netra provides Discord server management, moderation, and ticketing tools. We reserve the right to modify, suspend, or discontinue the service at any time.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">3. User Conduct</h2>
          <p>You agree not to use Netra for any unlawful purposes or to violate any Discord Terms of Service. Abuse of our systems may result in a permanent ban from our services.</p>
        </section>
      </div>
    </div>
  );
}
