import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeIndianRupee, Handshake, ShoppingBag, Sparkles, TrendingUp, Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCountUp } from "@/hooks/useAsync";

const STATS = [
  { label: "Women-led enterprises", value: 48, suffix: "+" },
  { label: "Products showcased", value: 320, suffix: "+" },
  { label: "Skill collaborations", value: 46, suffix: "" },
  { label: "Cooperatives connected", value: 12, suffix: "" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 60% at 85% 15%, rgba(112,71,168,0.10) 0%, rgba(112,71,168,0) 60%), radial-gradient(50% 50% at 10% 80%, rgba(22,140,135,0.10) 0%, rgba(22,140,135,0) 60%)",
        }}
      />
      <div className="container-hw grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-primary-dark shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            AI-assisted ecosystem for women-led enterprises
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Her Skills. Her Business.{" "}
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 bg-clip-text text-transparent">
              Her Way.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-charcoal-muted">
            HerWay AI connects women, skills, products, finances, and opportunities in one digital
            platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Join HerWay AI
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button size="lg" variant="outline">
                Explore Marketplace
              </Button>
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <Stat key={s.label} {...s} />
            ))}
          </dl>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "120ms" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label, suffix }: { value: number; label: string; suffix: string }) {
  const count = useCountUp(value);
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="font-heading text-2xl font-extrabold text-primary-dark sm:text-3xl">
        {count}
        {suffix}
      </dd>
      <p className="mt-0.5 text-xs font-medium text-charcoal-muted">{label}</p>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="relative aspect-square rounded-[2rem] border border-primary-100 bg-white p-5 shadow-card">
        <svg
          viewBox="0 0 400 400"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <defs>
            <linearGradient id="hw-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7047A8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#168C87" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g stroke="url(#hw-line)" strokeWidth="1.5" fill="none">
            <path d="M200 200 C 130 150, 90 110, 70 70" />
            <path d="M200 200 C 280 160, 320 120, 335 75" />
            <path d="M200 200 C 120 240, 80 290, 65 330" />
            <path d="M200 200 C 290 250, 330 300, 340 335" />
            <path d="M200 200 C 200 120, 200 90, 200 55" />
          </g>
          {[
            [70, 70], [335, 75], [65, 330], [340, 335], [200, 55],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#7047A8" fillOpacity="0.55" />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-primary-dark text-white shadow-hover">
          <span className="font-heading text-sm font-bold leading-tight text-center">
            HerWay<br />AI
          </span>
        </div>

        <FloatCard className="left-2 top-6" icon={<ShoppingBag className="h-4 w-4" />} title="Marketplace" subtitle="Handmade baskets" tone="primary" />
        <FloatCard className="right-1 top-16" icon={<Users className="h-4 w-4" />} title="Skill Match" subtitle="Tailoring + Embroidery" tone="secondary" />
        <FloatCard className="bottom-16 left-1" icon={<BadgeIndianRupee className="h-4 w-4" />} title="Savings" subtitle="₹18,400 recorded" tone="rose" />
        <FloatCard className="bottom-4 right-2" icon={<TrendingUp className="h-4 w-4" />} title="Growth" subtitle="2.4× monthly sales" tone="secondary" />
        <FloatCard className="left-1/2 top-2 -translate-x-1/2" icon={<Handshake className="h-4 w-4" />} title="Collaboration" subtitle="46 active" tone="primary" />
      </div>
    </div>
  );
}

function FloatCard({
  className,
  icon,
  title,
  subtitle,
  tone,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  tone: "primary" | "secondary" | "rose";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-600",
    secondary: "bg-secondary-50 text-secondary-600",
    rose: "bg-rose-100 text-rose-400",
  };
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-xl border border-charcoal/5 bg-white px-3 py-2 shadow-card ${className}`}
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </span>
      <div className="leading-tight">
        <p className="text-xs font-bold text-charcoal">{title}</p>
        <p className="text-[10px] text-charcoal-muted">{subtitle}</p>
      </div>
    </div>
  );
}