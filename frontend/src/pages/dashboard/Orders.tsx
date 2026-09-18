import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Truck } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { Tabs } from "@/components/ui/Tabs";
import { useAsync } from "@/hooks/useAsync";
import { formatCurrency, formatDate } from "@/utils/helpers";

const STAGES: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"];

const tone: Record<OrderStatus, "success" | "warning" | "secondary" | "neutral"> = {
  delivered: "success",
  shipped: "secondary",
  processing: "warning",
  confirmed: "warning",
  pending: "warning",
  cancelled: "neutral",
};

export function Orders() {
  const { user } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const { data, loading, setData } = useAsync(() => api.orders.list(user?.id), [user?.id]);

  const orders = (data || []).filter((o) => (tab === "all" ? true : o.status === tab));

  const advance = async (order: Order) => {
    const idx = STAGES.indexOf(order.status);
    const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
    const updated = await api.orders.updateStatus(order.id, next);
    setData((prev) => (prev || []).map((o) => (o.id === updated.id ? updated : o)));
    toast(`Order ${order.id} marked as ${next}`);
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track orders you've placed and their delivery status."
      />

      <Tabs
        className="mb-5 max-w-2xl"
        active={tab}
        onChange={setTab}
        tabs={[
          { id: "all", label: "All", count: (data || []).length },
          { id: "pending", label: "Pending" },
          { id: "shipped", label: "Shipped" },
          { id: "delivered", label: "Delivered" },
        ]}
      />

      {loading ? (
        <Spinner label="Loading orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title="No orders here"
          description="When you place or receive orders, they'll appear here with live status tracking."
          action={
            <Link to="/marketplace">
              <Button>Browse marketplace</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const stageIdx = STAGES.indexOf(order.status);
            return (
              <Card key={order.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/5 pb-4">
                  <div>
                    <p className="font-heading text-sm font-bold text-charcoal">{order.id}</p>
                    <p className="text-xs text-charcoal-muted">
                      Placed {formatDate(order.placedAt)} · {order.items.length} item
                      {order.items.length === 1 ? "" : "s"} · {order.delivery || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={tone[order.status]}>{order.status}</Badge>
                    <p className="font-heading text-base font-extrabold text-primary-dark">
                      {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>

                <ul className="divide-y divide-charcoal/5">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 py-3">
                      <img src={item.imageUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-charcoal">
                          {item.productName}
                        </p>
                        <p className="text-xs text-charcoal-muted">
                          Qty {item.quantity} · {formatCurrency(item.price)} each
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-charcoal/5 pt-4">
                  <div className="flex items-center gap-1.5">
                    {STAGES.map((stage, i) => (
                      <div key={stage} className="flex flex-1 items-center gap-1.5">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            i <= stageIdx
                              ? "bg-primary-600 text-white"
                              : "bg-charcoal/8 text-charcoal-muted"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {i < STAGES.length - 1 && (
                          <span
                            className={`h-0.5 flex-1 ${
                              i < stageIdx ? "bg-primary-600" : "bg-charcoal/8"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-charcoal-muted">
                    {STAGES.map((s) => (
                      <span key={s} className="capitalize">
                        {s}
                      </span>
                    ))}
                  </div>

                  {order.status !== "delivered" && order.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      leftIcon={<Truck className="h-3.5 w-3.5" />}
                      onClick={() => advance(order)}
                    >
                      Advance status (demo)
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-6 flex items-center gap-2 text-xs text-charcoal-muted">
        <Package className="h-3.5 w-3.5" aria-hidden /> Order tracking across pending → delivered.
        Demo data shown.
      </p>
    </div>
  );
}