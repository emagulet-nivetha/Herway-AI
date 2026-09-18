import { Link } from "react-router-dom";
import {
  ArrowRight, Bell, HandCoins, Package, ShoppingCart, Sparkles, TrendingUp, Users, Wallet,
} from "lucide-react";
import type { Order, Product, Transaction } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard, SavingsAreaChart, ContributionBarChart } from "@/components/dashboard/Charts";
import { Avatar, Badge, Card, StatCard } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency, formatDate, relativeTime } from "@/utils/helpers";

const statusTone: Record<string, "success" | "warning" | "secondary" | "neutral"> = {
  delivered: "success",
  shipped: "secondary",
  processing: "warning",
  pending: "warning",
  cancelled: "neutral",
};

export function MemberDashboard() {
  const { user } = useAuth();
  const { data: products, loading: pLoading } = useAsync(
    () => api.products.list({ sellerId: user?.id }),
    [user?.id]
  );
  const { data: orders } = useAsync(() => api.orders.list(user?.id), [user?.id]);
  const { data: finance, loading: fLoading } = useAsync(
    () => api.finance.summary(user?.id || ""),
    [user?.id]
  );

  const myProducts = products || [];
  const myOrders = orders || [];

  if (!user) return null;

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's an overview of your business activity on HerWay AI."
        actions={
          <>
            <Link to="/dashboard/products/new">
              <Button leftIcon={<Package className="h-4 w-4" />}>Add Product</Button>
            </Link>
            <Link to="/dashboard/ai-assistant">
              <Button variant="outline" leftIcon={<Sparkles className="h-4 w-4" />}>
                AI Assistant
              </Button>
            </Link>
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total savings"
          value={fLoading ? "…" : formatCurrency(finance?.totalSavings ?? 0)}
          icon={<Wallet className="h-5 w-5" />}
          tone="primary"
        />
        <StatCard
          label="Loan balance"
          value={fLoading ? "…" : formatCurrency(finance?.loanBalance ?? 0)}
          icon={<HandCoins className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          label="Active products"
          value={pLoading ? "…" : myProducts.filter((p: Product) => p.status === "active").length}
          icon={<Package className="h-5 w-5" />}
          tone="secondary"
        />
        <StatCard
          label="Orders"
          value={myOrders.length}
          icon={<ShoppingCart className="h-5 w-5" />}
          tone="rose"
          trend={{ value: `${myOrders.filter((o: Order) => o.status === "delivered").length} delivered`, positive: true }}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard
            title="Savings over time"
            subtitle="Cumulative savings recorded on the platform"
          >
            {fLoading ? (
              <Spinner label="Loading chart…" className="h-64 py-0" />
            ) : (
              <SavingsAreaChart data={finance?.savingsTrend ?? []} />
            )}
          </ChartCard>
        </div>

        <Card className="flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-charcoal">Profile strength</h3>
            <Badge tone="primary">Setup</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { label: "Profile created", done: true },
              { label: "Skills added", done: (user.achievements?.length ?? 0) >= 0 },
              { label: "Product listed", done: myProducts.length > 0 },
              { label: "First order", done: myOrders.length > 0 },
              { label: "AI assistant used", done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-charcoal-muted">{item.label}</span>
                <span
                  className={
                    item.done
                      ? "font-semibold text-green-600"
                      : "font-semibold text-charcoal-muted/60"
                  }
                >
                  {item.done ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
          <Link to="/dashboard/profile" className="mt-auto pt-5">
            <Button variant="subtle" fullWidth rightIcon={<ArrowRight className="h-4 w-4" />}>
              Complete your profile
            </Button>
          </Link>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-charcoal">Recent orders</h3>
              <Link to="/dashboard/orders" className="text-sm font-semibold text-primary-dark hover:underline">
                View all
              </Link>
            </div>
            {myOrders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-charcoal/15 py-10 text-center">
                <ShoppingCart className="mx-auto h-8 w-8 text-charcoal-muted/50" aria-hidden />
                <p className="mt-3 text-sm text-charcoal-muted">No orders yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-charcoal/5">
                {myOrders.slice(0, 4).map((order: Order) => (
                  <li key={order.id} className="flex items-center gap-3 py-3.5">
                    <img
                      src={order.items[0]?.imageUrl}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-charcoal">
                        {order.items[0]?.productName}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </p>
                      <p className="text-xs text-charcoal-muted">
                        {order.id} · {formatDate(order.placedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-charcoal">{formatCurrency(order.total)}</p>
                      <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card className="flex flex-col p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-charcoal">Quick actions</h3>
          </div>
          <div className="space-y-2.5">
            {[
              { to: "/dashboard/products/new", label: "Add a new product", icon: Package },
              { to: "/dashboard/finance", label: "View financial records", icon: Wallet },
              { to: "/dashboard/skills/matching", label: "Find skill matches", icon: Users },
              { to: "/dashboard/notifications", label: "Check notifications", icon: Bell },
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-xl border border-charcoal/8 px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-primary-300 hover:bg-primary-50"
              >
                <Icon className="h-4 w-4 text-primary-600" aria-hidden />
                {label}
                <ArrowRight className="ml-auto h-4 w-4 text-charcoal-muted" aria-hidden />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <ChartCard
          title="Monthly contributions"
          subtitle="Your savings contributions this period"
        >
          {(finance?.transactions?.length ?? 0) === 0 ? (
            <Spinner label="Loading chart…" className="h-64 py-0" />
          ) : (
            <ContributionBarChart
              data={(finance?.savingsTrend ?? []).map((s) => ({
                month: s.month,
                amount: Math.round(s.amount / Math.max(1, finance?.savingsTrend.length ?? 1)),
              }))}
            />
          )}
        </ChartCard>
      </div>

      <Card className="mt-6 flex flex-wrap items-center gap-4 bg-primary-50/50 p-5">
        <Avatar src={user.avatarUrl} name={user.name} size={48} />
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm font-bold text-charcoal">
            Your financial activity profile
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-charcoal-muted">
            This profile is an activity record, not a guaranteed credit score or lending decision.
            You control what is shared and with whom.
          </p>
        </div>
        <Link to="/dashboard/settings">
          <Button variant="outline" size="sm">Manage privacy</Button>
        </Link>
      </Card>

      <p className="mt-4 flex items-center gap-2 text-xs text-charcoal-muted">
        <TrendingUp className="h-3.5 w-3.5" aria-hidden />
        Last updated {relativeTime(new Date())} · Demo data shown for demonstration.
      </p>
    </div>
  );
}