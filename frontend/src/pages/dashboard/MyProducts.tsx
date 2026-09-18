import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Eye, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { Product } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Modal, Spinner } from "@/components/ui/Feedback";
import { Input, Select, Textarea } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { formatCurrency } from "@/utils/helpers";

export function MyProducts() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const debounced = useDebounced(search, 250);

  const { data, loading, setData } = useAsync(
    () => api.products.list({ sellerId: user?.id }),
    [user?.id]
  );

  const products = (data || []).filter((p) =>
    p.name.toLowerCase().includes(debounced.toLowerCase())
  );

  const saveEdit = async () => {
    if (!editTarget) return;
    setBusy(true);
    const updated = await api.products.update(editTarget.id, editTarget);
    setData((prev) => (prev || []).map((p) => (p.id === updated.id ? updated : p)));
    setBusy(false);
    setEditTarget(null);
    toast("Product updated");
  };

  const remove = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await api.products.remove(deleteTarget.id);
    setData((prev) => (prev || []).filter((p) => p.id !== deleteTarget.id));
    setBusy(false);
    setDeleteTarget(null);
    toast("Product removed");
  };

  return (
    <div>
      <PageHeader
        title="My Products"
        description="Manage your listings, stock, and availability."
        actions={
          <Link to="/dashboard/products/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Add Product</Button>
          </Link>
        }
      />

      <Card className="mb-5 p-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your products…"
            aria-label="Search products"
            className="pl-10"
          />
        </div>
      </Card>

      {loading ? (
        <Spinner label="Loading your products…" />
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Boxes className="h-6 w-6" />}
          title="No products yet"
          description="Add your first product to start selling on the marketplace."
          action={
            <Link to="/dashboard/products/new">
              <Button leftIcon={<Plus className="h-4 w-4" />}>Add your first product</Button>
            </Link>
          }
        />
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
            { key: "price", label: "Price", render: (p) => <span className="font-semibold text-charcoal">{formatCurrency(p.price)}</span> },
            { key: "stock", label: "Stock" },
            {
              key: "rating",
              label: "Rating",
              render: (p) => (
                <span className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {p.rating > 0 ? p.rating.toFixed(1) : "—"}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (p) => (
                <Badge tone={p.status === "active" ? "success" : "warning"}>{p.status}</Badge>
              ),
            },
            {
              key: "actions",
              label: "",
              className: "text-right",
              render: (p) => (
                <div className="flex justify-end gap-1">
                  <Link to={`/marketplace/${p.id}`} aria-label="View">
                    <Button variant="ghost" size="sm" className="px-2">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="px-2" onClick={() => setEditTarget(p)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 text-red-600 hover:bg-red-50"
                    onClick={() => setDeleteTarget(p)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={Boolean(editTarget)}
        onClose={() => setEditTarget(null)}
        title="Edit product"
        footer={
          <>
            <Button variant="subtle" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button onClick={saveEdit} loading={busy}>Save changes</Button>
          </>
        }
      >
        {editTarget && (
          <div className="space-y-4">
            <Input
              label="Product name"
              value={editTarget.name}
              onChange={(e) => setEditTarget({ ...editTarget, name: e.target.value })}
            />
            <Textarea
              label="Description"
              rows={4}
              value={editTarget.description}
              onChange={(e) => setEditTarget({ ...editTarget, description: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Price (₹)"
                type="number"
                value={editTarget.price}
                onChange={(e) => setEditTarget({ ...editTarget, price: Number(e.target.value) })}
              />
              <Input
                label="Stock"
                type="number"
                value={editTarget.stock}
                onChange={(e) => setEditTarget({ ...editTarget, stock: Number(e.target.value) })}
              />
            </div>
            <Select
              label="Availability"
              value={editTarget.availability}
              onChange={(e) =>
                setEditTarget({ ...editTarget, availability: e.target.value as Product["availability"] })
              }
            >
              <option>In Stock</option>
              <option>Made to Order</option>
              <option>Limited</option>
            </Select>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Remove product"
        size="sm"
        footer={
          <>
            <Button variant="subtle" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={remove} loading={busy}>Remove</Button>
          </>
        }
      >
        <p className="text-sm text-charcoal-muted">
          Are you sure you want to remove <strong className="text-charcoal">{deleteTarget?.name}</strong>?
          This can't be undone.
        </p>
      </Modal>
    </div>
  );
}