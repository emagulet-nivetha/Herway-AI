import { useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/utils/helpers";

const STATUSES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const tone: Record<OrderStatus, "success" | "warning" | "secondary" | "neutral"> = {
  delivered: "success",
  shipped: "secondary",
  processing: "warning",
  confirmed: "warning",
  pending: "warning",
  cancelled: "neutral",
};

export function CoopOrders() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debounced = useDebounced(search, 250);
  const { data, loading, setData } = useAsync(() => api.orders.list(), []);

  const orders = (data || []).filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(debounced.toLowerCase()) ||
      o.customerName.toLowerCase().includes(debounced.toLowerCase());
    return matchSearch && (status === "all" ? true : o.status === status);
  });

  const updateStatus = async (order: Order, next: OrderStatus) => {
    const updated = await api.orders.updateStatus(order.id, next);
    setData((prev) => (prev || []).map((o) => (o.id === updated.id ? updated : o)));
    toast(`${order.id} marked as ${next}`);
  };

  return (
    <div>
      <PageHeader title="Orders" description="Manage and fulfil all cooperative orders." />

      <Card className="mb-5 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer…"
            aria-label="Search orders"
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48" aria-label="Status filter">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Card>

      {loading ? (
        <Spinner label="Loading orders…" />
      ) : orders.length === 0 ? (
        <EmptyState icon={<ShoppingCart className="h-6 w-6" />} title="No orders found" description="Try a different search or filter." />
      ) : (
        <DataTable<Order>
          rows={orders}
          columns={[
            { key: "id", label: "Order", render: (o) => <span className="font-semibold text-charcoal">{o.id}</span> },
            { key: "customerName", label: "Customer", render: (o) => <span className="text-charcoal-muted">{o.customerName}</span> },
            { key: "placedAt", label: "Date", render: (o) => <span className="text-charcoal-muted">{formatDate(o.placedAt)}</span> },
            {
              key: "items",
              label: "Items",
              render: (o) => (
                <span className="text-charcoal-muted">
                  {o.items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              ),
            },
            { key: "total", label: "Total", render: (o) => <span className="font-semibold text-charcoal">{formatCurrency(o.total)}</span> },
            {
              key: "status",
              label: "Status",
              render: (o) => <Badge tone={tone[o.status]}>{o.status}</Badge>,
            },
            {
              key: "actions",
              label: "",
              className: "text-right",
              render: (o) => (
                <Select
                  value={o.status}
                  onChange={(e) => updateStatus(o, e.target.value as OrderStatus)}
                  aria-label={`Update status for ${o.id}`}
                  className="w-40 py-1.5 text-xs"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}