import { Link } from "react-router-dom";
import {
  BadgeCheck, FileBarChart, Package, ShoppingCart, TrendingUp, UserCheck, Users, Wallet,
} from "lucide-react";
import type { Product } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard, SavingsAreaChart, SkillDistributionChart, SalesLineChart } from "@/components/dashboard/Charts";
import { Avatar, Badge, Card, StatCard } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/utils/helpers";

export function CooperativeDashboard() {
  const { user } = useAuth();
  const { data: coop } = useAsync(
    () => (user?.cooperativeId ? api.cooperatives.get(user.cooperativeId) : Promise.resolve(null)),
    [user?.cooperativeId]
  );
  const { data: members } = useAsync(() => api.users.list(), []);
  const { data: products, loading: pLoading } = useAsync(() => api.products.list(), []);
  const { data: orders } = useAsync(() => api.orders.list(), []);
  const { data: analytics, loading: aLoading } = useAsync(() => api.analytics.summary(), []);

  const pendingProducts = (products || []).filter((p: Product) => p.status === "pending").length;

  return (
    <div>
      <PageHeader
        title={coop?.name || "Cooperative Dashboard"}
        description={`${coop?.location || "Your cooperative"} · ${coop?.type || "Cooperative"}`}
        actions={
          <>
            <Link to="/cooperative/reports">
              <Button variant="outline" leftIcon={<FileBarChart className="h-4 w-4" />}>
                Reports
              </Button>
            </Link>
            <Link to="/cooperative/members">
              <Button leftIcon={<UserCheck className="h-4 w-4" />}>Manage members</Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total members"
          value={coop?.members ?? (members || []).length}
          icon={<Users className="h-5 w-5" />}
          tone="primary"
          trend={{ value: `${coop?.activeMembers ?? 0} active`, positive: true }}
        />
        <StatCard
          label="Products"
          value={(products || []).length}
          icon={<Package className="h-5 w-5" />}
          tone="secondary"
          trend={pendingProducts > 0 ? { value: `${pendingProducts} awaiting approval` } : undefined}
        />
        <StatCard
          label="Orders"
          value={(orders || []).length}
          icon={<ShoppingCart className="h-5 w-5" />}
          tone="rose"
        />
        <StatCard
          label="Total savings"
          value={aLoading ? "…" : formatCurrency(analytics?.financial.totalSavings ?? 0)}
          icon={<Wallet className="h-5 w-5" />}
          tone="amber"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Cooperative savings trend" subtitle="Cumulative community savings (demo)">
            {aLoading ? (
              <Spinner className="h-64 py-0" label="Loading…" />
            ) : (
              <SavingsAreaChart data={analytics?.financial.savingsTrend ?? []} />
            )}
          </ChartCard>
        </div>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-charcoal">Verification queue</h3>
            <Badge tone={pendingProducts > 0 ? "warning" : "success"}>
              {pendingProducts > 0 ? `${pendingProducts} pending` : "All clear"}
            </Badge>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Profiles to verify", value: (members || []).filter((m) => !m.verified).length },
              { label: "Products to approve", value: pendingProducts },
              { label: "Active loans", value: 6 },
              { label: "Repayments this month", value: 18 },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm">
                <span className="text-charcoal-muted">{row.label}</span>
                <span className="font-heading font-bold text-charcoal">{row.value}</span>
              </div>
            ))}
          </div>
          <Link to="/cooperative/products" className="mt-4 block">
            <Button variant="subtle" fullWidth>Review products</Button>
          </Link>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Skill distribution" subtitle="Skills across your members">
          {aLoading ? (
            <Spinner className="h-72 py-0" />
          ) : (
            <SkillDistributionChart data={analytics?.community.skillDistribution ?? []} />
          )}
        </ChartCard>
        <ChartCard title="Product sales" subtitle="Units sold per product (demo)">
          {aLoading ? (
            <Spinner className="h-72 py-0" />
          ) : (
            <SalesLineChart data={analytics?.business.productPerformance ?? []} />
          )}
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-charcoal">Recent members</h3>
            <Link to="/cooperative/members" className="text-sm font-semibold text-primary-dark hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-charcoal/5">
            {(members || []).slice(0, 5).map((m) => (
              <li key={m.id} className="flex items-center gap-3 py-3">
                <Avatar src={m.avatarUrl} name={m.name} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-charcoal">{m.name}</p>
                  <p className="truncate text-xs text-charcoal-muted">{m.location}</p>
                </div>
                {m.verified ? (
                  <Badge tone="success"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
                ) : (
                  <Badge tone="warning">Pending</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-charcoal">Recent orders</h3>
            <Link to="/cooperative/orders" className="text-sm font-semibold text-primary-dark hover:underline">
              View all
            </Link>
          </div>
          {pLoading ? (
            <Spinner />
          ) : (
            <ul className="divide-y divide-charcoal/5">
              {(orders || []).slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <ShoppingCart className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-charcoal">{o.id}</p>
                    <p className="text-xs text-charcoal-muted">
                      {o.customerName} · {formatDate(o.placedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-charcoal">{formatCurrency(o.total)}</p>
                    <Badge tone="neutral">{o.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6 flex flex-wrap items-center gap-4 bg-secondary-50/60 p-5">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-600 text-white">
          <TrendingUp className="h-5 w-5" aria-hidden />
        </span>
        <p className="min-w-0 flex-1 text-xs leading-relaxed text-charcoal-light">
          <strong>Demo analytics.</strong> All figures on this page are fictional sample data for
          demonstration and do not represent real members or finances.
        </p>
      </Card>
    </div>
  );
}