import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Card, SectionHeading } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";

const VALUES = [
  {
    icon: Target,
    title: "Organize",
    text: "Turn scattered offline activity into organized digital records and listings.",
  },
  {
    icon: HeartHandshake,
    title: "Connect",
    text: "Bring together women, cooperatives, customers, and complementary skills.",
  },
  {
    icon: Sparkles,
    title: "Discover",
    text: "Surface markets, opportunities, and collaborations through AI assistance.",
  },
  {
    icon: ShieldCheck,
    title: "Respect",
    text: "Keep financial information private with consent-based, authorized access.",
  },
];

const PRINCIPLES = [
  "A digital infrastructure and AI-assisted ecosystem",
  "An activity record, not a guaranteed credit score or lending decision",
  "A tool that helps women organize, connect, showcase, and discover",
];

const NOT = [
  "A guaranteed lending platform",
  "A guaranteed income platform",
  "A replacement for banks, government schemes, or financial advice",
  "A system that automatically determines someone's financial worth",
  "A platform that guarantees business success",
];

export function About() {
  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
            About HerWay AI
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Digital infrastructure for women-led enterprises
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
            HerWay AI is an AI-powered digital platform for women-led Self-Help Groups, artisan
            groups, micro-cooperatives, and women entrepreneurs. We help women move from primarily
            offline operations to a connected digital ecosystem.
          </p>
          <p className="mt-6 font-heading text-xl font-bold text-primary-dark">
            Connect. Create. Grow.
          </p>
          <p className="mt-1 text-sm text-charcoal-muted">
            Empowering women to turn local skills into digital opportunities.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-hw">
          <SectionHeading
            eyebrow="What we do"
            title="Four ways HerWay AI supports growth"
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} hover className="p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-charcoal">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal-muted">{v.text}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-hw grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-secondary-100 bg-secondary-50/50 p-8">
            <h2 className="font-heading text-2xl font-bold text-charcoal">What HerWay AI is</h2>
            <ul className="mt-5 space-y-3">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-charcoal-light">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-secondary-600" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-charcoal/8 bg-cream p-8">
            <h2 className="font-heading text-2xl font-bold text-charcoal">What it is not</h2>
            <ul className="mt-5 space-y-3">
              {NOT.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-charcoal-muted">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-400" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-hw">
          <SectionHeading
            eyebrow="Who it's for"
            title="Built for women building businesses"
            description="Designed for the many forms women's enterprise takes across India."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Women SHG members",
              "Women artisans",
              "Micro-cooperatives",
              "Women entrepreneurs",
              "Women with professional skills",
              "Customers of women-made products",
              "Support organizations",
              "Financial partners (where appropriate)",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-charcoal/8 bg-white px-4 py-3.5 text-sm font-medium text-charcoal-light shadow-card"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-hw">
          <div className="rounded-3xl border border-primary-100 bg-primary-50/50 px-6 py-12 text-center sm:px-12">
            <h2 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">
              Join a connected ecosystem of women
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-charcoal-muted">
              Create your profile, add your skills and products, and start discovering opportunities.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Join HerWay AI
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline">How it works</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}