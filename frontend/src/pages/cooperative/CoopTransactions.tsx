import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Download, Search } from "lucide-react";
import type { Transaction, TransactionType } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { Badge, Card, StatCard } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/utils/helpers";

const tone: Record<TransactionType, "success" | "warning" | "secondary" | "neutral"> = {
  savings: "success",
  contribution: "secondary",
  repayment: "success",
  sale: "secondary",
  loan: "warning",
};

export function CoopTransactions() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const debounced = useDebounced(search, 250);

  const { data, loading } = useAsync(
    () => api.finance.transactions(user?.id || ""),
    [user?.id]
  );

  const transactions = (data || []).filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(debounced.toLowerCase());
    return matchSearch && (type === "all" ? true : t.type === type);
  });

  const inflow = (data || []).filter((t) => t.type !== "loan").reduce((s, t) => s + t.amount, 0);
  const outflow = (data || []).filter((t) => t.type === "loan").reduce((s, t) => s + t.amount, 0);

  const exportCsv = () => {
    const rows = [
      ["Date", "Type", "Description", "Amount"],
      ...transactions.map((t) => [formatDate(t.date), t.type, t.description, String(t.amount)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "herway-transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("Transactions exported as CSV (demo data)");
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="All recorded savings, contributions, loans, and sales."
        actions={
          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />} onClick={exportCsv}>
            Export CSV
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard label="Money in" value={formatCurrency(inflow)} icon={<ArrowDownLeft className="h-5 w-5" />} tone="secondary" />
        <StatCard label="Money out" value={formatCurrency(outflow)} icon={<ArrowUpRight className="h-5 w-5" />} tone="rose" />
        <StatCard label="Transactions" value={(data || []).length} tone="primary" />
      </div>

      <Card className="my-5 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transactions…"
            aria-label="Search transactions"
            className="pl-10"
          />
        </div>
        <Select value={type} onChange={(e) => setType(e.target.value)} className="sm:w-48" aria-label="Type filter">
          <option value="all">All types</option>
          <option value="savings">Savings</option>
          <option value="contribution">Contribution</option>
          <option value="repayment">Repayment</option>
          <option value="loan">Loan</option>
          <option value="sale">Sale</option>
        </Select>
      </Card>

      {loading ? (
        <Spinner label="Loading transactions…" />
      ) : (
        <DataTable<Transaction>
          rows={transactions}
          columns={[
            { key: "date", label: "Date", render: (t) => <span className="text-charcoal-muted">{formatDate(t.date)}</span> },
            { key: "description", label: "Description", render: (t) => <span className="font-medium text-charcoal">{t.description}</span> },
            { key: "type", label: "Type", render: (t) => <Badge tone={tone[t.type]}>{t.type}</Badge> },
            { key: "authorizedBy", label: "Authorised by", render: (t) => <span className="text-charcoal-muted">{t.authorizedBy || "—"}</span> },
            {
              key: "amount",
              label: "Amount",
              className: "text-right",
              render: (t) => (
                <span className={t.type === "loan" ? "font-semibold text-red-600" : "font-semibold text-secondary-700"}>
                  {t.type === "loan" ? "−" : "+"}
                  {formatCurrency(t.amount)}
                </span>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}