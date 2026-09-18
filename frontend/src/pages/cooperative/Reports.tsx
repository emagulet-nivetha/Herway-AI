import { useState } from "react";
import {
  BarChart3, Download, FileText, HandCoins, Package, Users,
} from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Form";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency } from "@/utils/helpers";

interface ReportDef {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  tone: "primary" | "secondary" | "rose" | "amber";
  build: () => string[][];
}

const toneBg: Record<ReportDef["tone"], string> = {
  primary: "bg-primary-50 text-primary-600",
  secondary: "bg-secondary-50 text-secondary-700",
  rose: "bg-rose-50 text-accent-600",
  amber: "bg-amber-50 text-amber-700",
};

export function Reports() {
  const { user } = useAuth();
  const toast = useToast();
  const [range, setRange] = useState("This quarter");
  const { data: products } = useAsync(() => api.products.list(), []);
  const { data: members } = useAsync(() => api.users.list(), []);
  const { data: orders } = useAsync(() => api.orders.list(), []);
  const { data: analytics } = useAsync(() => api.analytics.summary(), []);

  const reports: ReportDef[] = [
    {
      id: "members",
      title: "Membership report",
      description: "Member counts, verification status, and locations.",
      icon: Users,
      tone: "primary",
      build: () => [
        ["Membership report", range],
        ["Name", "Location", "Role", "Verified"],
        ...(members || []).map((m) => [m.name, m.location, m.role, m.verified ? "Yes" : "No"]),
      ],
    },
    {
      id: "products",
      title: "Product & sales report",
      description: "Catalogue with pricing, stock, and status.",
      icon: Package,
      tone: "secondary",
      build: () => [
        ["Product report", range],
        ["Product", "Seller", "Price", "Stock", "Status"],
        ...(products || []).map((p) => [p.name, p.sellerName, String(p.price), String(p.stock), p.status]),
      ],
    },
    {
      id: "orders",
      title: "Orders report",
      description: "Order history with customers and totals.",
      icon: BarChart3,
      tone: "rose",
      build: () => [
        ["Orders report", range],
        ["Order", "Customer", "Total", "Status"],
        ...(orders || []).map((o) => [o.id, o.customerName, String(o.total), o.status]),
      ],
    },
    {
      id: "finance",
      title: "Financial report",
      description: "Savings, loans, and recovery summary.",
      icon: HandCoins,
      tone: "amber",
      build: () => [
        ["Financial report", range],
        ["Metric", "Value"],
        ["Total savings", formatCurrency(analytics?.financial.totalSavings ?? 0)],
        ["Total loans", formatCurrency(analytics?.financial.totalLoans ?? 0)],
        ["Loan recovery rate", `${analytics?.financial.loanRecoveryRate ?? 0}%`],
        ["Total sales", formatCurrency(analytics?.business.totalSales ?? 0)],
        ["Total members", String(analytics?.community.totalMembers ?? 0)],
      ],
    },
  ];

  const download = (r: ReportDef) => {
    const csv = r.build().map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `herway-${r.id}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast(`${r.title} downloaded (demo data)`);
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        description={`Generate and export cooperative reports. Reporting period: ${range}.`}
        actions={
          <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-44" aria-label="Reporting period">
            <option>This month</option>
            <option>This quarter</option>
            <option>This year</option>
          </Select>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {reports.map((r) => {
          const Icon = r.icon;
          return (
            <Card key={r.id} className="flex items-start gap-4 p-5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneBg[r.tone]}`}>
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading text-base font-bold text-charcoal">{r.title}</h3>
                <p className="mt-1 text-sm text-charcoal-muted">{r.description}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  leftIcon={<Download className="h-3.5 w-3.5" />}
                  onClick={() => download(r)}
                >
                  Download CSV
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-5">
        <h3 className="font-heading text-base font-bold text-charcoal">Scheduled reports</h3>
        <p className="mt-1 text-sm text-charcoal-muted">
          In the full platform, cooperatives can schedule monthly PDF reports to be emailed to all
          office bearers. Configure the recipient below.
        </p>
        <div className="mt-4 max-w-sm">
          <label htmlFor="report-email" className="mb-1.5 block text-sm font-semibold text-charcoal">
            Send reports to
          </label>
          <div className="flex gap-2">
            <input
              id="report-email"
              type="email"
              defaultValue={user?.email}
              className="w-full rounded-xl border border-charcoal/10 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <Button onClick={() => toast("Report schedule saved (demo)")}>Save</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}