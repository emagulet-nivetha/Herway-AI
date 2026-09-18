import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, Check, Heart, MapPin, Minus, Package, Plus, ShieldCheck, ShoppingBag,
  Star, Truck,
} from "lucide-react";
import { api } from "@/services/api";
import { Avatar, Badge, Card, Rating } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { useAsync } from "@/hooks/useAsync";
import { classNames, formatCurrency } from "@/utils/helpers";

export function ProductDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { add, toggleWishlist, isWishlisted } = useCart();
  const toast = useToast();
  const [qty, setQty] = useState(1);

  const { data: product, loading, error } = useAsync(() => api.products.get(id), [id]);
  const { data: related } = useAsync(
    () => api.products.list({ category: product?.category }).then((r) => r.filter((p) => p.id !== id).slice(0, 3)),
    [product?.category, id]
  );

  if (loading) return <Spinner label="Loading product…" />;
  if (error || !product) {
    return (
      <div className="container-hw py-20">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or the link is incorrect."
          action={
            <Link to="/marketplace">
              <Button>Back to marketplace</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="container-hw py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-muted hover:text-primary-dark"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-card">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-square w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80";
            }}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">{product.category}</Badge>
            <Badge tone={product.availability === "In Stock" ? "success" : "warning"}>
              {product.availability}
            </Badge>
            {product.featured && <Badge tone="rose">Featured</Badge>}
          </div>

          <h1 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-charcoal">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.ratingCount} />
            <span className="flex items-center gap-1 text-sm text-charcoal-muted">
              <MapPin className="h-4 w-4" aria-hidden /> {product.location}
            </span>
          </div>

          <p className="mt-6 font-heading text-3xl font-extrabold text-primary-dark">
            {formatCurrency(product.price)}
          </p>
          <p className="mt-1 text-xs text-charcoal-muted">
            Price set by the seller. Taxes and delivery may apply at checkout.
          </p>

          <p className="mt-6 text-sm leading-relaxed text-charcoal-muted">{product.description}</p>

          {product.materials && product.materials.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-bold text-charcoal">Materials</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.materials.map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-charcoal/10 bg-cream px-3 py-1 text-xs text-charcoal-light"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-charcoal/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-charcoal-muted hover:text-primary-dark"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                className="p-3 text-charcoal-muted hover:text-primary-dark"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-charcoal-muted">
              {product.stock} available
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              onClick={() => {
                add(product, qty);
                toast(`${qty} × ${product.name} added to cart`);
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                add(product, qty);
                navigate("/checkout");
              }}
            >
              Buy Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              aria-pressed={wishlisted}
              onClick={() => {
                toggleWishlist(product.id);
                toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", "info");
              }}
              leftIcon={
                <Heart className={classNames("h-4 w-4", wishlisted && "fill-rose-400 text-rose-400")} />
              }
            >
              {wishlisted ? "Saved" : "Save"}
            </Button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Delivery", text: "Ships from seller" },
              { icon: ShieldCheck, title: "Support", text: "Direct seller contact" },
              { icon: Package, title: "Handmade", text: "Small-batch production" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-xl border border-charcoal/8 bg-white p-4">
                <Icon className="h-5 w-5 text-primary-600" aria-hidden />
                <p className="mt-2 text-xs font-bold text-charcoal">{title}</p>
                <p className="text-xs text-charcoal-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="mt-10 flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <Avatar src={undefined} name={product.sellerName} size={56} />
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">Seller</p>
          <h2 className="font-heading text-lg font-bold text-charcoal">{product.sellerName}</h2>
          {product.cooperative && (
            <p className="text-sm text-charcoal-muted">{product.cooperative}</p>
          )}
        </div>
        <Button variant="outline">View seller profile</Button>
      </Card>

      {related && related.length > 0 && (
        <section className="mt-14">
          <h2 className="font-heading text-xl font-bold text-charcoal">More like this</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Card key={p.id} hover className="overflow-hidden">
                <Link to={`/marketplace/${p.id}`}>
                  <img src={p.imageUrl} alt={p.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="p-4">
                    <h3 className="line-clamp-1 font-heading text-sm font-bold text-charcoal">{p.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="font-heading font-bold text-primary-dark">{formatCurrency(p.price)}</p>
                      <span className="flex items-center gap-1 text-xs text-charcoal-muted">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      )}

      <p className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-charcoal-muted">
        <Check className="h-3.5 w-3.5 text-secondary-600" aria-hidden />
        This is demo product data for demonstration purposes.
      </p>
    </div>
  );
}