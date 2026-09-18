import { HowItWorks as Steps } from "@/components/home/HowItWorks";
import { Solutions } from "@/components/home/Solutions";
import { FinalCta } from "@/components/home/Previews";
import { SectionHeading } from "@/components/ui/Display";
import { CheckCircle2 } from "lucide-react";

const DETAILS = [
  {
    title: "Create Profile",
    points: ["Choose your role: member or cooperative", "Add your location and languages", "Share your story and experience", "Verify your profile"],
  },
  {
    title: "Add Skills & Products",
    points: ["List your skills with experience level", "Upload product photos and descriptions", "Set prices and availability", "Manage inventory and orders"],
  },
  {
    title: "Connect With Customers & Women",
    points: ["Get discovered in the marketplace", "Receive and manage orders", "Find complementary skills", "Send collaboration requests"],
  },
  {
    title: "Grow With AI Insights",
    points: ["Generate product descriptions", "Get pricing and marketing help", "Plan and track simple finances", "Explore market insights"],
  },
];

export function HowItWorksPage() {
  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
            How It Works
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            From local skills to digital growth, step by step
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
            HerWay AI is designed to be clear and approachable — regardless of your experience with
            digital tools.
          </p>
        </div>
      </section>

      <Steps />

      <section className="py-20">
        <div className="container-hw">
          <SectionHeading
            eyebrow="In detail"
            title="What happens at each step"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {DETAILS.map((d, i) => (
              <div key={d.title} className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-card">
                <span className="font-heading text-sm font-bold text-primary-600">
                  Step {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-charcoal">{d.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {d.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-charcoal-muted">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Solutions />
      <FinalCta />
    </div>
  );
}