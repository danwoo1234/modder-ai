import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Modder AI",
  description: "Privacy Policy for Modder AI",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-foreground/40 mb-8">Last updated: March 30, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-foreground/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Introduction</h2>
            <p>
              Modder AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our website and services at modderai.net (the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Information We Collect</h2>
            <p><strong className="text-foreground">Account Information:</strong> When you sign in via Google, we receive your name, email address, and profile picture. We do not receive or store your Google password.</p>
            <p className="mt-2"><strong className="text-foreground">Usage Data:</strong> We collect information about how you use the Service, including tools used, generation counts, and session duration. This data is used to improve the Service.</p>
            <p className="mt-2"><strong className="text-foreground">Generated Content:</strong> We may temporarily process the prompts and content you submit to our AI tools to generate outputs. We do not sell your generated content.</p>
            <p className="mt-2"><strong className="text-foreground">Payment Information:</strong> Payment processing is handled by Lemon Squeezy. We do not store your credit card numbers or payment credentials on our servers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To provide and maintain the Service</li>
              <li>To manage your account and subscription</li>
              <li>To process transactions through our payment provider</li>
              <li>To communicate with you about updates, support, and promotions (with opt-out)</li>
              <li>To monitor usage, detect abuse, and enforce our Terms of Service</li>
              <li>To improve our AI models and tools (using anonymized, aggregated data only)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Data Sharing & Disclosure</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong className="text-foreground">Service Providers:</strong> Third parties that help us operate the Service (e.g., Cloudflare for hosting, Lemon Squeezy for payments, Google for authentication)</li>
              <li><strong className="text-foreground">AI Providers:</strong> Your prompts are sent to AI model providers (OpenAI, Anthropic) for processing. These providers have their own privacy policies.</li>
              <li><strong className="text-foreground">Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">5. Data Retention</h2>
            <p>
              We retain your account information for as long as your account is active. Usage data is retained for up to 12 months.
              Generated content is processed in real-time and not stored permanently. You may request deletion of your account
              and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">6. Data Security</h2>
            <p>
              We use industry-standard security measures including encryption in transit (TLS/SSL), encrypted storage,
              and access controls. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">7. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data (&quot;Right to be Forgotten&quot;)</li>
              <li>Object to or restrict processing</li>
              <li>Data portability</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-2">To exercise these rights, contact us at <a href="mailto:support@modderai.net" className="text-primary-light underline">support@modderai.net</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">8. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have the right to request disclosure of information we collect,
              request deletion of your data, and opt out of the sale of personal information. We do not sell personal
              information. To make a request, contact us at <a href="mailto:support@modderai.net" className="text-primary-light underline">support@modderai.net</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">9. Children&#39;s Privacy (COPPA)</h2>
            <p>
              The Service is not directed to children under 13. We do not knowingly collect personal information from
              children under 13. If we discover we have collected data from a child under 13, we will delete it promptly.
              If you believe a child under 13 has provided us data, contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">10. Cookies & Tracking</h2>
            <p>
              We use essential cookies for authentication and session management. We may use analytics cookies (e.g., to
              understand usage patterns). You can control cookies through your browser settings. We do not use cookies
              for targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">11. Third-Party Links</h2>
            <p>
              The Service may contain links to third-party websites. We are not responsible for the privacy practices of these sites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated
              policy on the Service. Your continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at:<br />
              <a href="mailto:support@modderai.net" className="text-primary-light underline">support@modderai.net</a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <Link href="/" className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
