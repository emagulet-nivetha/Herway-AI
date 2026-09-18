import { Link } from "react-router-dom";
import {
  ArrowRight, Bot, CheckCircle2, Quote, Send, Sparkles, TrendingUp, Users,
} from "lucide-react";
import {
  Area, AreaChart, ResponsiveContainer, Tooltip, XAxis,
} from "recharts";
import { SectionHeading, Badge, Avatar } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { DEMO_PRODUCTS, DEMO_STORIES, DEMO_ANALYTICS, DEMO_MATCHES } from "@/data/demo-data";
import { useCountUp, useOnScreen } from "@/hooks/useAsync";
import { classNames, formatCurrency } from "@/utils/helpers";

export function MarketplacePreview() {
  return (
    <section className="py-20">
      <div className="container-hw">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Marketplace"
            title="Women-made products, ready for the world"
            description="Browse handcrafted goods and services from women-led enterprises and cooperatives across India."
            align="left"
          />
          <Link to="/marketplace">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              View all products
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_PRODUCTS.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-charcoal-muted">
          Demo catalogue — products shown are sample data for demonstration.
        </p>
      </div>
    </section>
  );
}

export function SkillPreview() {
  const match = DEMO_MATCHES[0];
  return (
    <section className="bg-white py-20">
      <div className="container-hw">
        <SectionHeading
          eyebrow="Skill Connect"
          title="Your Skills Can Meet Her Skills."
          description="Create your skill profile and let the AI suggest women whose skills complement yours."
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 font-heading text-lg font-bold text-white">
              You
            </span>
            <p className="mt-4 font-heading text-lg font-bold text-charcoal">Embroidery</p>
            <p className="text-sm text-charcoal-muted">Intermediate · 6 years</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-600 text-white shadow-hover animate-pulse-soft">
              <Sparkles className="h-7 w-7" aria-hidden />
            </span>
            <span className="rounded-full border border-secondary-200 bg-white px-3 py-1 text-xs font-bold text-secondary-600">
              {match.matchScore}% experimental match
            </span>
            <ArrowRight className="h-5 w-5 rotate-90 text-charcoal-muted lg:rotate-0" aria-hidden />
          </div>

          <div className="rounded-2xl border border-secondary-100 bg-secondary-50/50 p-6 text-center">
            <Avatar src={match.avatarUrl} name={match.userName} size={56} className="mx-auto" />
            <p className="mt-4 font-heading text-lg font-bold text-charcoal">{match.userName}</p>
            <p className="text-sm text-charcoal-muted">Tailoring · Madurai</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-charcoal/8 bg-cream p-5 text-center">
          <p className="text-sm font-semibold text-charcoal">Suggested opportunity</p>
          <p className="mt-1 text-sm text-charcoal-muted">{match.opportunity}</p>
          <p className="mt-3 text-xs text-charcoal-muted">
            Match scores are experimental AI recommendations — not guarantees of collaboration,
            income, or success.
          </p>
        </div>
      </div>
    </section>
  );
}

export function AIPreview() {
  return (
    <section className="py-20">
      <div className="container-hw grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="AI Business Assistant"
            title="A guide for products, pricing, and planning"
            description="Get help with product descriptions, marketing ideas, simple business plans, and market research — in English, Tamil, or Hindi."
            align="left"
          />
          <ul className="mt-6 space-y-3">
            {[
              "Write product descriptions that sell",
              "Get pricing and marketing guidance",
              "Plan your next 30 days",
              "Understand basic financial concepts",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal-muted">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary-600" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Link to="/ai-assistant">
              <Button rightIcon={<ArrowRight className="h-4 w-4" />}>Try the AI Assistant</Button>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-charcoal/5 bg-white p-5 shadow-card">
          <div className="flex items-center gap-3 border-b border-charcoal/5 pb-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="font-heading text-sm font-bold text-charcoal">HerWay AI Assistant</p>
              <p className="text-xs text-secondary-600">Online · English, தமிழ், हिन्दी</p>
            </div>
            <Badge tone="secondary" className="ml-auto">Demo</Badge>
          </div>

          <div className="space-y-4 py-5">
            <ChatBubble role="user">
              Help me write a product description for my handwoven cotton stole.
            </ChatBubble>
            <ChatBubble role="assistant">
              <strong>Handwoven Cotton Stole</strong> — Lightweight and breathable, handwoven by a
              woman artisan using traditional spinning techniques. Perfect for all seasons, with
              tassel ends that add a graceful finish. Each piece is unique. Would you like me to add
              care instructions or a festive gift option?
            </ChatBubble>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-charcoal/10 bg-cream px-4 py-3">
            <span className="flex-1 text-sm text-charcoal-muted">
              Ask about products, business, skills…
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
              <Send className="h-4 w-4" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-charcoal-muted">
            AI-generated suggestions are guidance, not verified facts or guaranteed outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}

function ChatBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div className={classNames("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={classNames(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-primary-600 text-white"
            : "rounded-bl-sm bg-cream text-charcoal"
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ImpactDashboard() {
  const { ref, visible } = useOnScreen<HTMLDivElement>();
  const members = useCountUp(visible ? 128 : 0);
  const sales = useCountUp(visible ? 84200 : 0);

  return (
    <section className="bg-white py-20" ref={ref}>
      <div className="container-hw">
        <SectionHeading
          eyebrow="Impact Dashboard"
          title="Activity you can see and measure"
          description="Illustrative demo metrics showing how platform activity comes together — business, community, and finance."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-charcoal/5 bg-cream p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <TrendingUp className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-charcoal-muted">Demo platform sales</p>
            <p className="font-heading text-3xl font-extrabold text-charcoal">
              {formatCurrency(sales)}
            </p>
            <p className="mt-1 text-xs font-semibold text-green-600">Across 417 demo orders</p>
          </div>
          <div className="rounded-2xl border border-charcoal/5 bg-cream p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
              <Users className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-charcoal-muted">Demo community members</p>
            <p className="font-heading text-3xl font-extrabold text-charcoal">{members}</p>
            <p className="mt-1 text-xs font-semibold text-green-600">46 collaborations started</p>
          </div>
          <div className="rounded-2xl border border-charcoal/5 bg-cream p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-400">
              <Sparkles className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-charcoal-muted">Demo savings tracked</p>
            <p className="font-heading text-3xl font-extrabold text-charcoal">
              {formatCurrency(DEMO_ANALYTICS.financial.totalSavings)}
            </p>
            <p className="mt-1 text-xs font-semibold text-charcoal-muted">78% loan recovery (demo)</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-charcoal/5 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading text-sm font-bold text-charcoal">
                Community savings trend
              </p>
              <p className="text-xs text-charcoal-muted">Illustrative cumulative savings (demo)</p>
            </div>
            <Badge tone="primary">Demo data</Badge>
          </div>
          <div className="mt-5 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_ANALYTICS.financial.savingsTrend}>
                <defs>
                  <linearGradient id="hw-savings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7047A8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7047A8" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="#6B6B6B" />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#7047A8"
                  strokeWidth={2.5}
                  fill="url(#hw-savings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-charcoal-muted">
          These figures are fictional demo data, shown to illustrate platform features.
        </p>
      </div>
    </section>
  );
}

export function StoriesPreview() {
  return (
    <section className="py-20">
      <div className="container-hw">
        <SectionHeading
          eyebrow="Success Stories"
          title="Illustrative journeys of digital growth"
          description="Demonstration stories showing how the platform can be used. Real, verified stories would be supplied by users."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {DEMO_STORIES.map((story) => (
            <article
              key={story.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={story.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge tone="neutral" className="absolute left-3 top-3 bg-white/90">
                  Illustrative
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
                  {story.location}
                </p>
                <h3 className="mt-2 font-heading text-lg font-bold text-charcoal">{story.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted">
                  {story.summary}
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-charcoal/5 pt-4">
                  <p className="font-heading text-2xl font-extrabold text-primary-dark">
                    {story.stat}
                  </p>
                  <p className="text-xs text-charcoal-muted">{story.statLabel}</p>
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm italic text-charcoal-light">
                  <Quote className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" aria-hidden />
                  {story.quote}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/success-stories">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Read more stories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="py-20">
      <div className="container-hw">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-600 to-primary-dark px-6 py-16 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            aria-hidden
            style={{
              background:
                "radial-gradient(40% 60% at 80% 20%, rgba(233,167,184,0.6) 0%, transparent 60%), radial-gradient(40% 60% at 15% 85%, rgba(22,140,135,0.6) 0%, transparent 60%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="font-heading text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Your Skills Have Potential. HerWay Helps Connect Them to Opportunity.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-primary-100">
              Join a growing ecosystem of women and cooperatives organizing, connecting, showcasing,
              and discovering opportunities — digitally.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="bg-white text-primary-dark hover:bg-primary-50">
                  Join HerWay AI
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:border-white hover:bg-white/10"
                >
                  Explore the Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}