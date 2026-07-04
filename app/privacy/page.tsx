export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-6 space-y-8">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-6 text-foreground/80 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">1. Data We Collect</h2>
          <p>We collect basic information required to provide our services, such as your Discord User ID, Guild IDs, and necessary permissions.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">2. How We Use Your Data</h2>
          <p>Your data is used solely for the operation of Netra, including identifying you in the dashboard, checking your permissions, and securely saving your server settings.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3 text-foreground">3. Data Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website or bot.</p>
        </section>
      </div>
    </div>
  );
}
