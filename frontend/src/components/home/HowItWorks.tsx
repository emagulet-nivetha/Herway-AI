import { Link } from "react-router-dom";
import { ArrowRight, PackagePlus, Sparkles, UserPlus, UsersRound } from "lucide-react";
import { SectionHeading } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { useOnScreen } from "@/hooks/useAsync";
import { classNames } from "@/utils/helpers";

const STEPS = [
  {
    number: "01",
    title: "Create Profile",
    text: "Sign up as a member or cooperative and set up your digital identity with your location, languages, and story.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Add Skills & Products",
    text: "List your skills, upload products with photos, set prices, and organize your inventory.",
    icon: PackagePlus,
  },
  {
    number: "03",
    title: "Connect With Customers & Women",
    text: "Reach buyers through the marketplace and discover women with complementary skills.",
    icon: UsersRound,
  },
  {
    number: "04",
    title: "Grow With AI Insights",
    text: "Use the AI assistant for descriptions, pricing, marketing, planning, and market research.",
    icon: Sparkles,
  },
];

export function HowItWorks({ withCta = false }: { withCta?: boolean }) {
  const { ref, visible } = useOnScreen<HTMLDivElement>();

  return (
    <section className="bg-white py-20" id="how-it-works">
      <div className="container-hw">
        <SectionHeading
          eyebrow="How It Works"
          title="A simple path from local skills to digital growth"
          description="Four clear steps — designed to be understandable regardless of your experience with digital tools."
        />

        <div ref={ref} className="relative mt-16">
          <div
            className="absolute left-0 right-0 top-[38px] hidden h-0.5 bg-gradient-to-r from-primary-200 via-secondary-300 to-primary-200 lg:block"
            aria-hidden
          >
            <div
              className={classNames(
                "h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-[1600ms] ease-out",
                visible ? "w-full" : "w-0"
              )}
            />
          </div>

          <ol className="relative grid gap-8 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="flex flex-col items-center text-center animate-fade-in-up"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="relative z-10 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border-2 border-primary-100 bg-white shadow-card">
                    <Icon className="h-7 w-7 text-primary-600" aria-hidden />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-secondary-600 font-heading text-xs font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-charcoal-muted">
                    {step.text}
                  </p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="mt-5 h-5 w-5 rotate-90 text-primary-300 lg:hidden" aria-hidden />
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        {withCta && (
          <div className="mt-14 text-center">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Start your journey
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}