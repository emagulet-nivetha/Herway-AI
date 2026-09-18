import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ImagePlus, Sparkles, Upload, Wand2 } from "lucide-react";
import { api } from "@/services/api";
import { aiService } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Input, Select, Textarea } from "@/components/ui/Form";
import { CATEGORIES, SKILL_LIST } from "@/data/demo-data";
import { classNames, readFileAsDataUrl } from "@/utils/helpers";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80";

export function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "Handicrafts",
    price: "",
    stock: "",
    description: "",
    materials: "",
    tags: "",
    availability: "In Stock",
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 3) e.name = "Enter a product name (min 3 characters).";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter a valid price.";
    if (!form.stock || Number(form.stock) < 1) e.stock = "Enter available stock.";
    if (form.description.trim().length < 20)
      e.description = "Add a description of at least 20 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const generateDescription = async () => {
    if (form.name.trim().length < 3) {
      toast("Enter a product name first", "error");
      return;
    }
    setAiLoading(true);
    const res = await aiService.productDescription(
      `${form.name}. Materials: ${form.materials || "not specified"}. Category: ${form.category}.`
    );
    setForm((prev) => ({ ...prev, description: res.text.replace(/\*\*/g, "") }));
    setAiLoading(false);
    toast("AI drafted a description — review and edit before saving.");
  };

  const onImage = async (file?: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast("Image must be under 5 MB", "error");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }
    const url = await readFileAsDataUrl(file);
    setImagePreview(url);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await api.products.create({
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description.trim(),
        availability: form.availability as "In Stock" | "Made to Order" | "Limited",
        imageUrl: imagePreview || PLACEHOLDER,
        materials: form.materials
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
        sellerId: user?.id,
        sellerName: user?.name,
        cooperative: user?.cooperative,
        location: user?.location,
      });
      toast("Product added successfully");
      navigate("/dashboard/products");
    } catch (err) {
      toast((err as Error).message || "Could not save product", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Add Product"
        description="List a new product on the marketplace. You can edit it anytime."
      />

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]" noValidate>
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-heading text-base font-bold text-charcoal">Product details</h2>
            <div className="mt-5 space-y-5">
              <Input
                label="Product name"
                required
                value={form.name}
                error={errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Handwoven Cotton Stole"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                <Select
                  label="Availability"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                >
                  <option>In Stock</option>
                  <option>Made to Order</option>
                  <option>Limited</option>
                </Select>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Price (₹)"
                  type="number"
                  required
                  value={form.price}
                  error={errors.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 549"
                />
                <Input
                  label="Stock quantity"
                  type="number"
                  required
                  value={form.stock}
                  error={errors.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="e.g. 20"
                />
              </div>
              <Input
                label="Materials (comma separated)"
                value={form.materials}
                onChange={(e) => setForm({ ...form, materials: e.target.value })}
                placeholder="e.g. Cotton, Natural dye"
              />
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="desc" className="mb-1.5 block text-sm font-medium text-charcoal">
                    Description <span className="text-rose-400">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    loading={aiLoading}
                    leftIcon={<Wand2 className="h-3.5 w-3.5" />}
                    onClick={generateDescription}
                  >
                    AI draft
                  </Button>
                </div>
                <Textarea
                  id="desc"
                  rows={6}
                  value={form.description}
                  error={errors.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your product, what makes it special, and how it's made…"
                />
                <p className="mt-1 flex items-center gap-1.5 text-xs text-charcoal-muted">
                  <Sparkles className="h-3 w-3 text-secondary-600" aria-hidden />
                  AI-generated text is a suggestion — always review before publishing.
                </p>
              </div>
              <Input
                label="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                placeholder="e.g. handmade, cotton, gift"
                hint={`Popular: ${SKILL_LIST.slice(0, 5).join(", ")}`}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-heading text-base font-bold text-charcoal">Product image</h2>
            <label
              className={classNames(
                "mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
                imagePreview ? "border-primary-300 bg-primary-50/40" : "border-charcoal/15 hover:border-primary-300"
              )}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="h-40 w-full rounded-xl object-cover" />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-primary-600" aria-hidden />
                  <p className="mt-3 text-sm font-semibold text-charcoal">Upload a photo</p>
                  <p className="mt-1 text-xs text-charcoal-muted">
                    JPG or PNG, up to 5 MB. Natural daylight photos work best.
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onImage(e.target.files?.[0])}
              />
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-charcoal/12 bg-white px-3 py-1.5 text-xs font-semibold text-charcoal">
                <Upload className="h-3.5 w-3.5" /> {imagePreview ? "Change image" : "Choose file"}
              </span>
            </label>
            {imagePreview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-red-600"
                onClick={() => setImagePreview("")}
              >
                Remove image
              </Button>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="font-heading text-base font-bold text-charcoal">Listing preview</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-charcoal/8">
              <img
                src={imagePreview || PLACEHOLDER}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-4">
                <p className="line-clamp-1 text-sm font-bold text-charcoal">
                  {form.name || "Your product name"}
                </p>
                <p className="mt-1 text-xs text-charcoal-muted">{user?.cooperative || user?.name}</p>
                <p className="mt-2 font-heading text-lg font-extrabold text-primary-dark">
                  ₹{form.price ? Number(form.price).toLocaleString("en-IN") : "0"}
                </p>
              </div>
            </div>
          </Card>

          <Alert tone="info">
            New listings are reviewed for quality. You can save as a draft or publish immediately in
            the live platform.
          </Alert>

          <div className="flex gap-3">
            <Button type="submit" fullWidth loading={saving} leftIcon={<Upload className="h-4 w-4" />}>
              Publish product
            </Button>
            <Button type="button" variant="subtle" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>

          <p className="flex items-start gap-2 text-xs text-charcoal-muted">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
            By publishing you confirm the product is your own work and the details are accurate.
          </p>
        </div>
      </form>
    </div>
  );
}