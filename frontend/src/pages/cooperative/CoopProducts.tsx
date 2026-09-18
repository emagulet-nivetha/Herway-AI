import { useState } from "react";
import { Check, Package, Search, X } from "lucide-react";
import type { Product } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { formatCurrency } from "@/utils/helpers";

export function CoopProducts() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const debounced = useDebounced(search, 250);
  const { data, loading, setData } = useAsync(() => api.products.list(), []);

  const products = (data || []).filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(debounced.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(debounced.toLowerCase());
    const matchStatus = status === "all" ? true : p.status === status;
    return matchSearch && matchStatus;
  });

  const setStatusFor = async (p: Product, newStatus: Product["status"]) => {
    const updated = await api.products.update(p.id, { status: newStatus });
    setData((prev) => (prev || []).map((x) => (x.id === updated.id ? updated : x)));
    toast(`${p.name} ${newStatus === "active" ? "approved" : "set inactive"}`);
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Review, approve, and manage products listed by your members."
      />

      <Card className="mb-5 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or seller…"
            aria-label="Search products"
            className="pl-10"
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-52" aria-label="Status filter">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending approval</option>
          <option value="inactive">Inactive</option>
        </Select>
      </Card>

      {loading ? (
        <Spinner label="Loading products…" />
      ) : products.length === 0 ? (
        <EmptyState icon={<Package className="h-6 w-6" />} title="No products found" description="Try a different search or filter." />
      ) : (
        <DataTable<Product>
          rows={products}
          columns={[
            {
              key: "name",
              label: "Product",
              render: (p) => (
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-charcoal">{p.name}</p>
                    <p className="text-xs text-charcoal-muted">{p.category}</p>
                  </div>
                </div>
              ),
            },
            { key: "sellerName", label: "Seller", render: (p) => <span className="text-charcoal-muted">{p.sellerName}</span> },
            { key: "price", label: "Price", render: (p) => <span className="font-semibold text-charcoal">{formatCurrency(p.price)}</span> },
            { key: "stock", label: "Stock" },
            {
              key: "status",
              label: "Status",
              render: (p) => (
                <Badge tone={p.status === "active" ? "success" : p.status === "pending" ? "warning" : "neutral"}>
                  {p.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              label: "",
              className: "text-right",
              render: (p) => (
                <div className="flex justify-end gap-2">
                  {p.status !== "active" ? (
                    <Button size="sm" variant="outline" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={() => setStatusFor(p, "active")}>
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      leftIcon={<X className="h-3.5 w-3.5" />}
                      onClick={() => setStatusFor(p, "inactive")}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
        />
      )}

      <p className="mt-5 text-xs text-charcoal-muted">
        Approving products keeps catalogue quality high. Admins can deactivate listings that break
        guidelines.
      </p>
    </div>
  );
}