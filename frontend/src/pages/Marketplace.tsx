import { useEffect, useMemo, useState } from "react";
import { Filter, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/types";
import { api } from "@/services/api";
import { CATEGORIES, INDIAN_STATES } from "@/data/demo-data";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Form";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Display";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { classNames } from "@/utils/helpers";

export function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounced(search, 300);

  const { data, loading, error, reload } = useAsync(
    () => api.products.list({ search: debouncedSearch, category, location, sort }),
    [debouncedSearch, category, location, sort]
  );

  const products = useMemo(
    () => (data || []).filter((p) => p.price <= maxPrice),
    [data, maxPrice]
  );

  useEffect(() => {
    setFiltersOpen(false);
  }, [category, location, maxPrice, sort]);

  const activeFilterCount =
    (category !== "all" ? 1 : 0) + (location !== "all" ? 1 : 0) + (maxPrice < 4000 ? 1 : 0);

  const clearFilters = () => {
    setCategory("all");
    setLocation("all");
    setMaxPrice(4000);
    setSort("featured");
    setSearch("");
  };

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-heading text-sm font-bold text-charcoal">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={classNames(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                category === c.value
                  ? "bg-primary-50 text-primary-dark"
                  : "text-charcoal-muted hover:bg-cream"
              )}
            >
              {c.name}
              {category === c.value && <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-bold text-charcoal">Location</h3>
        <Select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="all">All locations</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <h3 className="mb-3 font-heading text-sm font-bold text-charcoal">
          Max price: ₹{maxPrice.toLocaleString("en-IN")}
        </h3>
        <input
          type="range"
          min={100}
          max={4000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary-600"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-xs text-charcoal-muted">
          <span>₹100</span>
          <span>₹4,000</span>
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="subtle" fullWidth onClick={clearFilters} leftIcon={<X className="h-4 w-4" />}>
          Clear filters
        </Button>
      )}
    </div>
  );

  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-10">
        <div className="container-hw">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
                Marketplace
              </h1>
              <p className="mt-2 text-sm text-charcoal-muted">
                Discover handcrafted products and services from women-led enterprises.
              </p>
            </div>
            <Badge tone="neutral">Demo catalogue</Badge>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, artisans, or tags…"
                aria-label="Search products"
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
                className="min-w-[150px]"
              >
                <option value="featured">Featured first</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest rated</option>
              </Select>
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setFiltersOpen(true)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-hw flex gap-8">
          <aside className="hidden w-60 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-charcoal/5 bg-white p-5 shadow-card">
              <div className="mb-4 flex items-center gap-2 text-charcoal">
                <Filter className="h-4 w-4" aria-hidden />
                <span className="font-heading text-sm font-bold">Filters</span>
              </div>
              {filterPanel}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <Spinner label="Loading products…" />
            ) : error ? (
              <EmptyState
                title="Couldn't load products"
                description={error}
                action={<Button onClick={reload}>Try again</Button>}
              />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products match your filters"
                description="Try adjusting your search or clearing a filter to see more results."
                action={<Button onClick={clearFilters}>Clear filters</Button>}
              />
            ) : (
              <>
                <p className="mb-4 text-sm text-charcoal-muted">
                  Showing <span className="font-semibold text-charcoal">{products.length}</span>{" "}
                  product{products.length === 1 ? "" : "s"}
                  {location !== "all" && (
                    <>
                      {" "}
                      in <span className="font-semibold text-charcoal">{location}</span>
                    </>
                  )}
                </p>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((p: Product) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
            onClick={() => setFiltersOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 scrollbar-thin animate-fade-in-up">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-charcoal">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="rounded-lg p-1.5 hover:bg-charcoal/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <Button fullWidth className="mt-6" onClick={() => setFiltersOpen(false)}>
              Show {products.length} products
            </Button>
          </div>
        </div>
      )}

      <div className="hidden items-center gap-2 text-xs text-charcoal-muted">
        <MapPin className="h-3 w-3" /> Location filters available
      </div>
    </div>
  );
}