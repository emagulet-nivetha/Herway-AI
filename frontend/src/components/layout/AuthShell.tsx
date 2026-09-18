import { BadgeCheck, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Logo } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const bullets = [
    { icon: Sparkles, text: "AI business assistance" },
    { icon: Users, text: "Skill collaboration network" },
    { icon: BadgeCheck, text: "Digital marketplace" },
    { icon: ShieldCheck, text: "Private, consent-based finance tools" },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo size="lg" />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="font-heading text-3xl font-extrabold text-charcoal">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-charcoal-muted">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-charcoal-muted">{footer}</div>}
        </div>
        <p className="mx-auto max-w-md text-center text-xs leading-relaxed text-charcoal-muted">
          Demo platform. HerWay AI is a digital infrastructure and AI-assisted ecosystem — not a
          lending platform or a guaranteed income platform.
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary-600 via-primary-600 to-primary-dark lg:flex lg:flex-col lg:justify-center lg:px-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          aria-hidden
          style={{
            background:
              "radial-gradient(45% 55% at 80% 20%, rgba(233,167,184,0.7) 0%, transparent 60%), radial-gradient(45% 55% at 15% 85%, rgba(22,140,135,0.7) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-md">
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-primary-200">
            HerWay AI
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-white">
            Connect. Create. Grow.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-primary-100">
            Empowering women to turn local skills into digital opportunities.
          </p>
          <ul className="mt-8 space-y-4">
            {bullets.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-4.5 w-4.5" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-primary-100">
              Try the demo: <span className="font-semibold text-white">lakshmi@demo.herway</span> ·{" "}
              <span className="font-semibold text-white">HerWay@123</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
