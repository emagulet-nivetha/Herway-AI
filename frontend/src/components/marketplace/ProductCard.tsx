import { Link } from "react-router-dom";
import { Heart, MapPin, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import { classNames, formatCurrency } from "@/utils/helpers";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWishlist, isWishlisted } = useCart();
  const toast = useToast();
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
        <Link to={`/marketplace/${product.id}`} aria-label={product.name}>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80";
            }}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.featured && <Badge tone="primary">Featured</Badge>}
          {product.availability !== "In Stock" && (
            <Badge tone="warning">{product.availability}</Badge>
          )}
        </div>
        <button
          onClick={() => {
            toggleWishlist(product.id);
            toast(wishlisted ? "Removed from wishlist" : "Added to wishlist", "info");
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-charcoal-muted backdrop-blur transition-colors hover:text-rose-400"
        >
          <Heart className={classNames("h-4 w-4", wishlisted && "fill-rose-400 text-rose-400")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/marketplace/${product.id}`} className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400">
          <h3 className="line-clamp-2 font-heading text-sm font-bold leading-snug text-charcoal hover:text-primary-dark">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 truncate text-xs text-charcoal-muted">
          {product.cooperative || product.sellerName}
        </p>

        <div className="mt-2 flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span className="text-xs font-semibold text-charcoal">
              {product.rating > 0 ? product.rating.toFixed(1) : "New"}
            </span>
            {product.ratingCount > 0 && (
              <span className="text-xs text-charcoal-muted">({product.ratingCount})</span>
            )}
          </span>
          <span className="flex min-w-0 items-center gap-1 text-xs text-charcoal-muted">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden />
            <span className="truncate">{product.location.split(",")[0]}</span>
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2 pt-1">
          <p className="font-heading text-lg font-extrabold text-primary-dark">
            {formatCurrency(product.price)}
          </p>
          <span
            className={classNames(
              "text-[11px] font-semibold",
              product.availability === "In Stock" ? "text-green-600" : "text-amber-600"
            )}
          >
            {product.availability}
          </span>
        </div>

        <Button
          size="sm"
          fullWidth
          className="mt-3"
          leftIcon={<ShoppingBag className="h-4 w-4" />}
          onClick={() => {
            add(product);
            toast(`${product.name} added to cart`);
          }}
        >
          Add to Cart
        </Button>
      </div>
    </article>
  );
}