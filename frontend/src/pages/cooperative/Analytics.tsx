import {
  BarChart3, Package, TrendingUp, Users, Wallet,
} from "lucide-react";
import { api } from "@/services/api";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import {
  ChartCard, ContributionBarChart, RepaymentPie, SalesLineChart, SkillDistributionChart,
} from "@/components/dashboard/Charts";
import { Badge, Card, StatCard } from "@/components/ui/Display";
import { Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency } from "@/utils/helpers";

export function Analytics() {
  const { data, loading } = useAsync(() => api.analytics.summary(), []);

  const performance = data?.business.productPerformance ?? [];
  const topProducts = [...performance].sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Business, community, and financial insights across your cooperative."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total sales"
          value={loading ? "…" : formatCurrency(data?.business.totalSales ?? 0)}
          icon={<Wallet className="h-5 w-5" />}
          tone="secondary"
          trend={{ value: "+12% vs last quarter", positive: true }}
        />
        <StatCard
          label="Total orders"
          value={loading ? "…" : data?.business.totalOrders ?? 0}
          icon={<Package className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Active members"
          value={loading ? "…" : data?.community.totalMembers ?? 0}
          icon={<Users className="h-5 w-5" />}
          tone="rose"
        />
        <StatCard
          label="Collaborations"
          value={loading ? "…" : data?.community.collaborations ?? 0}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Product performance" subtitle="Units sold per product (demo data)">
            {loading ? <Spinner className="h-72 py-0" /> : <SalesLineChart data={performance} />}
          </ChartCard>
        </div>
        <ChartCard title="Loan recovery" subtitle="Repaid vs outstanding">
          {loading ? (
            <Spinner className="h-72 py-0" />
          ) : (
            <RepaymentPie
              data={[
                { label: "Recovered", value: data?.financial.loanRecoveryRate ?? 0 },
                { label: "Outstanding", value: 100 - (data?.financial.loanRecoveryRate ?? 0) },
              ]}
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Savings contributions" subtitle="Community savings trend">
          {loading ? (
            <Spinner className="h-72 py-0" />
          ) : (
            <ContributionBarChart data={data?.financial.savingsTrend ?? []} />
          )}
        </ChartCard>
        <ChartCard title="Skill distribution" subtitle="Members per skill group">
          {loading ? <Spinner className="h-72 py-0" /> : <SkillDistributionChart data={data?.community.skillDistribution ?? []} />}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-3 font-heading text-lg font-bold text-charcoal">Top products</h2>
          <DataTable<(typeof topProducts)[number]>
            rows={topProducts}
            columns={[
              { key: "name", label: "Product", render: (p) => <span className="font-semibold text-charcoal">{p.name}</span> },
              { key: "sales", label: "Units sold", render: (p) => <span className="text-charcoal-muted">{p.sales}</span> },
              {
                key: "revenue",
                label: "Revenue",
                className: "text-right",
                render: (p) => <span className="font-semibold text-secondary-700">{formatCurrency(p.revenue)}</span>,
              },
            ]}
          />
        </div>

        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <BarChart3 className="h-4 w-4 text-primary-600" aria-hidden /> Insights
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {[
              "Tailoring and handicrafts drive the largest share of sales.",
              "Loan recovery is above the cooperative's target threshold.",
              "Adding product photos increases conversion in the marketplace.",
              "Skill matching can pair producers with complementary artisans.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 rounded-xl bg-cream p-3 text-charcoal-light">
                <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                {tip}
              </li>
            ))}
          </ul>
          <Badge tone="neutral" className="mt-4">Illustrative demo insights</Badge>
        </Card>
      </div>
    </div>
  );
}