import { useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, Eye, EyeOff, Lock, Plus, ShieldCheck, Wallet,
} from "lucide-react";
import type { Transaction, TransactionType } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { ChartCard, SavingsAreaChart, ContributionBarChart } from "@/components/dashboard/Charts";
import { Badge, Card, StatCard } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Alert, EmptyState, Modal, Spinner } from "@/components/ui/Feedback";
import { Input, Select, Textarea } from "@/components/ui/Form";
import { useAsync } from "@/hooks/useAsync";
import { classNames, formatCurrency, formatDate } from "@/utils/helpers";

const TX_META: Record<TransactionType, { label: string; tone: "success" | "warning" | "secondary" | "primary" | "neutral"; inflow: boolean }> = {
  savings: { label: "Savings", tone: "primary", inflow: true },
  contribution: { label: "Contribution", tone: "secondary", inflow: true },
  sale: { label: "Sale", tone: "success", inflow: true },
  repayment: { label: "Repayment", tone: "warning", inflow: false },
  loan: { label: "Loan", tone: "neutral", inflow: true },
};

export function FinancialRecords() {
  const { user } = useAuth();
  const toast = useToast();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [consent, setConsent] = useState({
    adminView: true,
    lenderShare: false,
    exportData: false,
  });
  const [form, setForm] = useState({
    type: "savings" as TransactionType,
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const { data: finance, loading, reload } = useAsync(
    () => api.finance.summary(user?.id || ""),
    [user?.id]
  );

  const mask = (v: number) => (hideAmounts ? "••••••" : formatCurrency(v));

  const addTransaction = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      toast("Enter a valid amount", "error");
      return;
    }
    setSaving(true);
    await api.finance.addTransaction({
      userId: user?.id || "",
      type: form.type,
      amount: Number(form.amount),
      description: form.description || "Manual entry",
      date: form.date,
      authorizedBy: user?.id,
    });
    setSaving(false);
    setAddOpen(false);
    setForm({ type: "savings", amount: "", description: "", date: new Date().toISOString().slice(0, 10) });
    reload();
    toast("Record added successfully");
  };

  const monthly = (finance?.transactions || [])
    .filter((t) => t.type === "savings" || t.type === "contribution")
    .reduce((acc, t) => {
      const m = new Date(t.date).toLocaleString("en", { month: "short" });
      const found = acc.find((a) => a.month === m);
      if (found) found.amount += t.amount;
      else acc.push({ month: m, amount: t.amount });
      return acc;
    }, [] as { month: string; amount: number }[]);

  return (
    <div>
      <PageHeader
        title="Financial Records"
        description="A clear, simple view of your savings, loans, and transactions."
        actions={
          <>
            <Button
              variant="outline"
              leftIcon={hideAmounts ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              onClick={() => setHideAmounts((v) => !v)}
            >
              {hideAmounts ? "Show" : "Hide"} amounts
            </Button>
            <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
              Add record
            </Button>
          </>
        }
      />

      <Alert tone="info" className="mb-6">
        <span className="flex items-start gap-2">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong>Privacy:</strong> Your financial information is private. Only you and
            administrators you explicitly authorize can see it.{" "}
            <button onClick={() => setPrivacyOpen(true)} className="font-semibold text-secondary-600 hover:underline">
              Manage privacy & consent
            </button>
          </span>
        </span>
      </Alert>

      {loading ? (
        <Spinner label="Loading financial records…" />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total savings"
              value={mask(finance?.totalSavings ?? 0)}
              icon={<Wallet className="h-5 w-5" />}
              tone="primary"
            />
            <StatCard
              label="Loan balance"
              value={mask(finance?.loanBalance ?? 0)}
              icon={<ArrowDownLeft className="h-5 w-5" />}
              tone="amber"
            />
            <StatCard
              label="Total repaid"
              value={mask(finance?.totalRepaid ?? 0)}
              icon={<ArrowUpRight className="h-5 w-5" />}
              tone="secondary"
            />
            <StatCard
              label="Total sales"
              value={mask(finance?.totalSales ?? 0)}
              icon={<ArrowUpRight className="h-5 w-5" />}
              tone="rose"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ChartCard title="Savings over time" subtitle="Cumulative savings recorded">
              <SavingsAreaChart data={finance?.savingsTrend ?? []} />
            </ChartCard>
            <ChartCard title="Monthly contributions" subtitle="Savings and contributions by month">
              {monthly.length > 0 ? (
                <ContributionBarChart data={monthly} />
              ) : (
                <EmptyState title="No contributions yet" description="Add a record to see this chart." />
              )}
            </ChartCard>
          </div>

          <div className="mt-6">
            <h3 className="mb-4 font-heading text-lg font-bold text-charcoal">Transaction history</h3>
            <DataTable<Transaction>
              rows={finance?.transactions ?? []}
              empty={
                <EmptyState
                  title="No transactions yet"
                  description="Your savings, loans, and sales activity will appear here."
                />
              }
              columns={[
                {
                  key: "date",
                  label: "Date",
                  render: (t) => <span className="text-charcoal-muted">{formatDate(t.date)}</span>,
                },
                {
                  key: "description",
                  label: "Description",
                  render: (t) => <span className="font-medium text-charcoal">{t.description}</span>,
                },
                {
                  key: "type",
                  label: "Type",
                  render: (t) => (
                    <Badge tone={TX_META[t.type].tone}>{TX_META[t.type].label}</Badge>
                  ),
                },
                {
                  key: "amount",
                  label: "Amount",
                  className: "text-right",
                  render: (t) => (
                    <span
                      className={classNames(
                        "font-semibold",
                        TX_META[t.type].inflow ? "text-green-600" : "text-charcoal"
                      )}
                    >
                      {TX_META[t.type].inflow ? "+" : "−"}
                      {mask(t.amount)}
                    </span>
                  ),
                },
              ]}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-800">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>
                This profile is an activity record, not a guaranteed credit score or lending
                decision. HerWay AI does not calculate creditworthiness and does not guarantee loans.
              </span>
            </p>
          </div>
        </>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a record"
        footer={
          <>
            <Button variant="subtle" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addTransaction} loading={saving}>Save record</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })}
          >
            <option value="savings">Savings</option>
            <option value="contribution">Contribution</option>
            <option value="repayment">Repayment</option>
            <option value="sale">Sale</option>
          </Select>
          <Input
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            placeholder="e.g. 500"
          />
          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Textarea
            label="Note"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="e.g. Weekly savings contribution"
          />
          <Alert tone="info">
            Records you add are visible only to you and authorized administrators.
          </Alert>
        </div>
      </Modal>

      <Modal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy & Consent"
        footer={<Button onClick={() => { setPrivacyOpen(false); toast("Privacy preferences saved"); }}>Save preferences</Button>}
      >
        <div className="space-y-5">
          <div>
            <h3 className="font-heading text-sm font-bold text-charcoal">
              Who can view this information?
            </h3>
            <p className="mt-1 text-xs text-charcoal-muted">
              You decide who can see your financial activity. You can change this at any time.
            </p>
          </div>

          {[
            { key: "adminView" as const, label: "My cooperative administrator", desc: "Can view and help maintain my records" },
            { key: "lenderShare" as const, label: "Financial partners", desc: "Share my activity record with authorized partners" },
            { key: "exportData" as const, label: "Data export", desc: "Allow exporting my records as a report" },
          ].map((opt) => (
            <label
              key={opt.key}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-charcoal/10 p-4 hover:border-primary-300"
            >
              <input
                type="checkbox"
                checked={consent[opt.key]}
                onChange={(e) => setConsent({ ...consent, [opt.key]: e.target.checked })}
                className="mt-0.5 accent-primary-600"
              />
              <div>
                <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                <p className="text-xs text-charcoal-muted">{opt.desc}</p>
              </div>
            </label>
          ))}

          <Alert tone="warning" title="No guaranteed credit decisions">
            Sharing your activity record does not guarantee loan approval and does not constitute a
            credit score. Lenders make independent decisions.
          </Alert>
        </div>
      </Modal>
    </div>
  );
}