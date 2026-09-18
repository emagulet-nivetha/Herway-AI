import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";

export function Wishlist() {
  const { wishlist } = useCart();
  const { data: products, loading } = useAsync(() => api.products.list(), []);

  const saved = (products || []).filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <PageHeader
        title="Wishlist"
        description={
          saved.length > 0
            ? `${saved.length} product${saved.length === 1 ? "" : "s"} saved for later.`
            : "Products you've saved for later."
        }
      />

      {loading ? (
        <Spinner label="Loading wishlist…" />
      ) : saved.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          action={
            <Link to="/marketplace">
              <Button>Browse marketplace</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}