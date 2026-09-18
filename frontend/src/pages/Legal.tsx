import { SectionHeading } from "@/components/ui/Display";

const LEGAL: Record<string, { title: string; intro: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "HerWay AI treats your information with care. This demonstration policy explains how data is handled on the platform.",
    sections: [
      {
        heading: "Information we collect",
        body: "Profile details you provide (name, location, skills, languages), product listings, orders, and optional financial records. In this demo, all data is stored locally in your browser and is not transmitted to a server.",
      },
      {
        heading: "Financial information",
        body: "Financial records are private by default. Only you and authorized cooperative administrators you grant access to can view them. They are never shared publicly or sold.",
      },
      {
        heading: "Consent",
        body: "Any sharing of your financial activity profile requires your explicit, revocable consent. Consent records are tracked and can be withdrawn at any time from Settings.",
      },
      {
        heading: "Your controls",
        body: "You can edit or delete your profile, products, and records at any time. You may request deletion of your account and associated demo data.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    intro:
      "By using HerWay AI you agree to these terms. This is a demonstration platform intended for evaluation.",
    sections: [
      {
        heading: "Nature of the service",
        body: "HerWay AI is a digital infrastructure and AI-assisted ecosystem for women-led enterprises. It helps users organize, connect, showcase, and discover opportunities.",
      },
      {
        heading: "No financial guarantees",
        body: "HerWay AI is not a lending platform, a guaranteed income platform, or a replacement for banks, government schemes, or professional financial advice. The financial activity profile is an activity record, not a credit score or lending decision.",
      },
      {
        heading: "AI-generated content",
        body: "AI features provide suggestions that may be incomplete or inaccurate. AI output is not verified fact and should be reviewed before you rely on it.",
      },
      {
        heading: "Acceptable use",
        body: "You agree not to misuse the platform, post unlawful content, or attempt to access other users' private information without authorization.",
      },
    ],
  },
  help: {
    title: "Help Center",
    intro: "Quick answers to common questions about using HerWay AI.",
    sections: [
      {
        heading: "How do I create an account?",
        body: "Select 'Join HerWay' and choose your role — member or cooperative. Then add your profile details, skills, and products.",
      },
      {
        heading: "How does the marketplace work?",
        body: "Browse or search products, add items to your cart, and place an order. Sellers receive and manage orders from their dashboard.",
      },
      {
        heading: "How does Skill Connect work?",
        body: "Create a skill profile, then explore suggested matches — women whose skills complement yours. Match scores are experimental recommendations, not guarantees.",
      },
      {
        heading: "Is my financial data safe?",
        body: "Yes. Financial records are private and accessible only to you and administrators you explicitly authorize. Convenors can be granted view access with your consent.",
      },
    ],
  },
};

export function LegalPage({ kind }: { kind: "privacy" | "terms" | "help" }) {
  const content = LEGAL[kind];
  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl">
          <h1 className="font-heading text-4xl font-extrabold text-charcoal">{content.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-charcoal-muted">{content.intro}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container-hw max-w-3xl space-y-8">
          {content.sections.map((s) => (
            <div key={s.heading} className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-card">
              <h2 className="font-heading text-lg font-bold text-charcoal">{s.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{s.body}</p>
            </div>
          ))}
          <p className="text-center text-xs text-charcoal-muted">
            This content is provided for demonstration purposes.
          </p>
        </div>
      </section>
    </div>
  );
}

export function Help() {
  return <LegalPage kind="help" />;
}