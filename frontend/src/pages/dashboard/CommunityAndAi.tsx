import { CommunityFeed } from "@/components/community/CommunityFeed";
import { ChatInterface } from "@/components/ai/ChatInterface";

export function DashboardCommunity() {
  return <CommunityFeed />;
}

export function DashboardAiAssistant() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-extrabold text-charcoal sm:text-3xl">
          AI Business Assistant
        </h1>
        <p className="mt-1.5 text-sm text-charcoal-muted">
          Your personal guide for products, business planning, marketing, and growth.
        </p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div>
          <ChatInterface />
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-charcoal/5 bg-white p-5 shadow-card">
            <h2 className="font-heading text-base font-bold text-charcoal">
              What I can help with
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-charcoal-muted">
              {[
                "Product descriptions",
                "Pricing guidance",
                "Marketing ideas",
                "Business planning",
                "Customer communication",
                "Financial education basics",
                "Skill development",
                "Market research & translation",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-heading text-sm font-bold text-amber-800">Important</h2>
            <p className="mt-2 text-xs leading-relaxed text-amber-800">
              AI suggestions are generated guidance, not verified facts. HerWay AI does not provide
              credit scores, loan approvals, or guaranteed income.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
