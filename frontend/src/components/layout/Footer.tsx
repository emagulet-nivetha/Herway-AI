import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "About HerWay AI", to: "/about" },
      { label: "How It Works", to: "/how-it-works" },
      { label: "Marketplace", to: "/marketplace" },
      { label: "Skill Connect", to: "/skill-connect" },
      { label: "Cooperative Network", to: "/cooperatives" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Join HerWay", to: "/signup" },
      { label: "Login", to: "/login" },
      { label: "AI Assistant", to: "/ai-assistant" },
      { label: "Success Stories", to: "/success-stories" },
      { label: "Community", to: "/community" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", to: "/contact" },
      { label: "Help Center", to: "/help" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-charcoal/5 bg-white">
      <div className="container-hw py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Logo size="lg" />
            <p className="mt-4 font-heading text-lg font-bold text-primary-dark">
              Connect. Create. Grow.
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal-muted">
              Empowering women to turn local skills into digital opportunities.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Youtube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-charcoal/10 text-charcoal-muted transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-dark"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-charcoal">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-charcoal-muted transition-colors hover:text-primary-dark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-primary-100 bg-primary-50/60 px-5 py-4">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal-light">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden />
            <span>
              <strong>Important:</strong> HerWay AI is a digital infrastructure and AI-assisted
              ecosystem. It is not a lending platform, a guaranteed income platform, or a replacement
              for banks or government schemes. The financial activity profile is an activity record,
              not a guaranteed credit score or lending decision.
            </span>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-charcoal/5 pt-6 text-xs text-charcoal-muted sm:flex-row">
          <p>© {new Date().getFullYear()} HerWay AI. A demonstration social-impact platform.</p>
          <p>Built with care for women-led enterprises across India.</p>
        </div>
      </div>
    </footer>
  );
}