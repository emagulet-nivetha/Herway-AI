import {
  Bot, BarChart3, LineChart as LineIcon, MapPin, Sparkles, Store, Wallet,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/Display";
import { Badge } from "@/components/ui/Display";
import { classNames } from "@/utils/helpers";

type Solution = {
  icon: typeof Store;
  title: string;
  tone: "primary" | "secondary" | "rose";
  points: readonly string[];
  note?: string;
};

const SOLUTIONS: Solution[] = [
  {
    icon: Store,
    title: "Digital Marketplace",
    tone: "primary",
    points: ["Create product listings", "Upload product images", "Set prices & manage inventory", "Receive orders & track sales"],
  },
  {
    icon: Wallet,
    title: "Digital Financial Records",
    tone: "secondary",
    points: ["Record savings & loans", "Track repayments", "Log contributions", "Simple dashboards & charts"],
    note: "Includes clear privacy and authorization controls.",
  },
  {
    icon: MapPin,
    title: "Market Access",
    tone: "rose",
    points: ["Product discovery & search", "Categories & location filters", "Recommendations", "Customer interaction & orders"],
  },
  {
    icon: Sparkles,
    title: "Skill Connect",
    tone: "primary",
    points: ["Create a skill profile", "Discover complementary skills", "AI collaboration suggestions", "Send collaboration requests"],
  },
  {
    icon: LineIcon,
    title: "Financial Activity Profile",
    tone: "secondary",
    points: ["Savings consistency", "Repayment history", "Business transactions", "Cooperative participation"],
    note: "This profile is an activity record, not a guaranteed credit score or lending decision.",
  },
  {
    icon: Bot,
    title: "AI Business Assistant",
    tone: "rose",
    points: ["Product descriptions", "Pricing & marketing ideas", "Business planning", "Market research & translation"],
  },
];

const tones = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  rose: "bg-rose-100 text-rose-400",
};

export function Solutions() {
  return (
    <section className="py-20" id="solutions">
      <div className="container-hw">
        <SectionHeading
          eyebrow="Our Solution"
          title="One Platform. Multiple Opportunities."
          description="Six connected modules that help women and cooperatives organize, connect, showcase, and discover opportunities."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className="group flex flex-col rounded-2xl border border-charcoal/5 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-hover"
              >
                <span
                  className={classNames(
                    "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                    tones[s.tone]
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">{s.title}</h3>
                <ul className="mt-4 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-charcoal-muted">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                {s.note && (
                  <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800">
                    {s.note}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-center">
          <Badge tone="primary"><BarChart3 className="h-3 w-3" /> Demo data used throughout</Badge>
          <Badge tone="secondary">AI suggestions are guidance, not verified facts</Badge>
          <Badge tone="neutral">Consent-based financial visibility</Badge>
        </div>
      </div>
    </section>
  );
}