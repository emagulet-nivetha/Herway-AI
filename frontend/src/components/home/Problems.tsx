import { useState } from "react";
import {
  ArrowRight, Globe, LineChart, Network, NotebookPen, ShoppingBag,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/Display";
import { classNames } from "@/utils/helpers";

const PROBLEMS = [
  {
    icon: ShoppingBag,
    title: "No Digital Presence",
    text: "Products often depend on local markets and middlemen, limiting visibility and profit opportunities.",
    tone: "primary",
  },
  {
    icon: NotebookPen,
    title: "Fragmented Financial Records",
    text: "Savings, loans, and repayments are often maintained through paper-based records.",
    tone: "secondary",
  },
  {
    icon: Globe,
    title: "Limited Market Access",
    text: "Local businesses struggle to reach customers beyond their communities.",
    tone: "rose",
  },
  {
    icon: Network,
    title: "Lack of Skill Connections",
    text: "Women with complementary skills often lack a platform to discover and collaborate with one another.",
    tone: "primary",
  },
  {
    icon: LineChart,
    title: "Weak Credit Visibility",
    text: "Informal financial activity may not be easily visible to formal financial institutions.",
    tone: "secondary",
  },
] as const;

const tones = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-600",
  rose: "bg-rose-100 text-rose-400",
};

export function Problems() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-20" id="problems">
      <div className="container-hw">
        <SectionHeading
          eyebrow="The Problem"
          title="What Women-Led Communities Face Today"
          description="Across India, women build remarkable products and businesses — but the tools they use haven't kept pace with their ambition."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.title}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={classNames(
                    "group rounded-2xl border p-5 text-left transition-all duration-200",
                    active === i
                      ? "border-primary-300 bg-primary-50/50 shadow-card"
                      : "border-charcoal/8 bg-white hover:border-primary-200 hover:bg-cream"
                  )}
                  aria-pressed={active === i}
                >
                  <span
                    className={classNames(
                      "flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
                      tones[p.tone]
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-charcoal">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{p.text}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-charcoal/8 bg-cream p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-secondary-600">
              The shift we enable
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              {["Offline", "Connected", "Digital Growth"].map((step, i) => (
                <div key={step} className="flex w-full flex-col items-center">
                  <div
                    className={classNames(
                      "w-full rounded-xl px-5 py-4 font-heading text-sm font-bold transition-colors",
                      i === 0 && "bg-charcoal/5 text-charcoal-muted",
                      i === 1 && "bg-secondary-600 text-white",
                      i === 2 && "bg-gradient-to-r from-primary-600 to-primary-dark text-white"
                    )}
                  >
                    {step}
                  </div>
                  {i < 2 && <ArrowRight className="my-1 h-5 w-5 rotate-90 text-charcoal-muted" aria-hidden />}
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs leading-relaxed text-charcoal-muted">
              From local, paper-based, and isolated — to visible, connected, and growing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}