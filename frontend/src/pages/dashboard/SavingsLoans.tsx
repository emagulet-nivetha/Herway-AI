import { Calendar, HandCoins, PiggyBank, TrendingDown } from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { ChartCard, RepaymentPie } from "@/components/dashboard/Charts";
import { Badge, Card, StatCard } from "@/components/ui/Display";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/utils/helpers";

export function SavingsLoans() {
  const { user } = useAuth();
  const { data: savings, loading: sLoading } = useAsync(
    () => api.finance.savings(user?.id || ""),
    [user?.id]
  );
  const { data: loans, loading: lLoading } = useAsync(
    () => api.finance.loans(user?.id || ""),
    [user?.id]
  );
  const { data: repayments } = useAsync(
    () => api.finance.repayments(user?.id || ""),
    [user?.id]
  );
  const { data: finance } = useAsync(
    () => api.finance.summary(user?.id || ""),
    [user?.id]
  );

  const activeLoan = (loans || []).find((l) => l.status === "active");
  const totalSavings = (savings || []).reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <PageHeader
        title="Savings & Loans"
        description="Track your savings contributions, active loans, and repayments."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total savings" value={formatCurrency(totalSavings)} icon={<PiggyBank className="h-5 w-5" />} tone="primary" />
        <StatCard label="Active loan" value={formatCurrency(activeLoan?.principal ?? 0)} icon={<HandCoins className="h-5 w-5" />} tone="amber" />
        <StatCard label="Outstanding balance" value={formatCurrency(activeLoan?.balance ?? 0)} icon={<TrendingDown className="h-5 w-5" />} tone="rose" />
        <StatCard label="Total repaid" value={formatCurrency(finance?.totalRepaid ?? 0)} icon={<HandCoins className="h-5 w-5" />} tone="secondary" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Repayment progress" subtitle="How much of your loan is repaid">
            {activeLoan ? (
              <div className="space-y-4">
                <RepaymentPie data={finance?.repaymentProgress ?? []} />
                <div className="flex items-center justify-center gap-6 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-secondary-600" /> Repaid
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" /> Remaining
                  </span>
                </div>
                <div className="rounded-xl bg-cream p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-charcoal-muted">Progress</span>
                    <span className="font-bold text-charcoal">
                      {Math.round(
                        ((activeLoan.principal - activeLoan.balance) / activeLoan.principal) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-charcoal/8">
                    <div
                      className="h-full rounded-full bg-secondary-600"
                      style={{
                        width: `${((activeLoan.principal - activeLoan.balance) / activeLoan.principal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<HandCoins className="h-6 w-6" />}
                title="No active loan"
                description="You currently have no active loans with your cooperative."
              />
            )}
          </ChartCard>
        </div>

        <Card className="p-5">
          <h3 className="font-heading text-base font-bold text-charcoal">Loan details</h3>
          {lLoading ? (
            <Spinner className="py-8" />
          ) : activeLoan ? (
            <dl className="mt-4 space-y-3.5 text-sm">
              <Detail label="Loan ID" value={activeLoan.id} />
              <Detail label="Principal" value={formatCurrency(activeLoan.principal)} />
              <Detail label="Interest rate" value={`${activeLoan.interestRate}% p.a.`} />
              <Detail label="Issued on" value={formatDate(activeLoan.issuedAt)} />
              <Detail label="Purpose" value={activeLoan.purpose || "—"} />
              <Detail label="Status" value={<Badge tone="warning">Active</Badge>} />
            </dl>
          ) : (
            <p className="mt-4 text-sm text-charcoal-muted">No active loan details.</p>
          )}
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="mb-4 flex items-center gap-2 font-heading text-lg font-bold text-charcoal">
          <Calendar className="h-5 w-5 text-primary-600" aria-hidden /> Savings contributions
        </h3>
        <DataTable
          rows={savings || []}
          empty={<EmptyState title="No savings records yet" description="Your savings entries will appear here." />}
          columns={[
            { key: "date", label: "Date", render: (r) => <span className="text-charcoal-muted">{formatDate(r.date)}</span> },
            { key: "note", label: "Note", render: (r) => <span className="font-medium text-charcoal">{r.note || r.channel || "Savings"}</span> },
            { key: "channel", label: "Channel", render: (r) => <Badge tone="neutral">{r.channel || "Digital"}</Badge> },
            { key: "amount", label: "Amount", className: "text-right", render: (r) => <span className="font-semibold text-green-600">{formatCurrency(r.amount)}</span> },
          ]}
        />
      </div>

      <div className="mt-6">
        <h3 className="mb-4 font-heading text-lg font-bold text-charcoal">Repayment history</h3>
        <DataTable
          rows={repayments || []}
          empty={<EmptyState title="No repayments yet" description="Repayment entries will appear here." />}
          columns={[
            { key: "date", label: "Date", render: (r) => <span className="text-charcoal-muted">{formatDate(r.date)}</span> },
            { key: "loanId", label: "Loan", render: (r) => <span className="font-medium text-charcoal">{r.loanId}</span> },
            { key: "amount", label: "Amount paid", className: "text-right", render: (r) => <span className="font-semibold text-charcoal">{formatCurrency(r.amount)}</span> },
          ]}
        />
      </div>

      <p className="mt-6 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-charcoal-muted">
        These records are private. They are an activity record — not a credit score and not a
        lending decision.
      </p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-charcoal-muted">{label}</dt>
      <dd className="text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}