import { HandCoins, Landmark, TrendingUp, Wallet } from "lucide-react";
import { api } from "@/services/api";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { ChartCard, RepaymentPie, SavingsAreaChart } from "@/components/dashboard/Charts";
import { Badge, Card, StatCard } from "@/components/ui/Display";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency } from "@/utils/helpers";

export function FinancialOverview() {
  const { data: analytics, loading } = useAsync(() => api.analytics.summary(), []);
  const { data: members } = useAsync(() => api.users.list(), []);

  const fin = analytics?.financial;

  const contributions = (members || []).slice(0, 8).map((m, i) => ({
    id: m.id,
    name: m.name,
    location: m.location,
    savings: 12000 + i * 3500,
    contributed: 2000,
    status: i % 4 === 0 ? "Overdue" : "On time",
  }));

  return (
    <div>
      <PageHeader
        title="Financial Overview"
        description="A transparent, aggregated view of cooperative savings, loans, and recovery."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total community savings"
          value={loading ? "…" : formatCurrency(fin?.totalSavings ?? 0)}
          icon={<Wallet className="h-5 w-5" />}
          tone="secondary"
          trend={{ value: "+8.4% this quarter", positive: true }}
        />
        <StatCard
          label="Outstanding loans"
          value={loading ? "…" : formatCurrency(fin?.totalLoans ?? 0)}
          icon={<Landmark className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Loan recovery rate"
          value={loading ? "…" : `${fin?.loanRecoveryRate ?? 0}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="primary"
          trend={{ value: "Healthy", positive: true }}
        />
        <StatCard
          label="Monthly contributions"
          value="₹2,000"
          icon={<HandCoins className="h-5 w-5" />}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Community savings trend" subtitle="Cumulative savings over time (demo)">
            {loading ? <Spinner className="h-72 py-0" /> : <SavingsAreaChart data={fin?.savingsTrend ?? []} />}
          </ChartCard>
        </div>
        <ChartCard title="Loan status" subtitle="Repaid vs outstanding (demo)">
          {loading ? (
            <Spinner className="h-72 py-0" />
          ) : (
            <RepaymentPie
              data={[
                { label: "Repaid", value: 100 - (fin?.loanRecoveryRate ?? 0) === 0 ? 100 : (fin?.loanRecoveryRate ?? 0) },
                { label: "Outstanding", value: 100 - (fin?.loanRecoveryRate ?? 0) },
              ]}
            />
          )}
        </ChartCard>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-heading text-lg font-bold text-charcoal">Member contributions</h2>
        <DataTable<(typeof contributions)[number]>
          rows={contributions}
          columns={[
            { key: "name", label: "Member", render: (r) => <span className="font-semibold text-charcoal">{r.name}</span> },
            { key: "location", label: "Location", render: (r) => <span className="text-charcoal-muted">{r.location}</span> },
            { key: "savings", label: "Savings", render: (r) => <span className="font-semibold text-charcoal">{formatCurrency(r.savings)}</span> },
            { key: "contributed", label: "Monthly", render: (r) => <span className="text-charcoal-muted">{formatCurrency(r.contributed)}</span> },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge tone={r.status === "On time" ? "success" : "warning"}>{r.status}</Badge>,
            },
          ]}
        />
      </div>

      <div className="mt-6">
        <Alert tone="info" title="Transparency first">
          This is an aggregated activity record for the cooperative. It is not a credit report, and it
          does not determine loan eligibility or guarantee any financial outcome.
        </Alert>
      </div>
    </div>
  );
}