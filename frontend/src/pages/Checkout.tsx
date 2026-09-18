import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, MapPin, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { api } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card, EmptyState } from "@/components/ui/Display";
import { Input, Select } from "@/components/ui/Form";
import { Alert } from "@/components/ui/Feedback";
import { formatCurrency, isValidEmail } from "@/utils/helpers";

export function Checkout() {
  const { lines, subtotal, setQuantity, remove, clear } = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<"cart" | "details" | "done">("cart");
  const [payment, setPayment] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const delivery = subtotal > 1500 ? 0 : 80;
  const total = subtotal + delivery;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!isValidEmail(form.email)) e.email = "Valid email required";
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "10-digit phone required";
    if (form.address.trim().length < 5) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "6-digit PIN required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setPlacing(true);
    try {
      const order = await api.orders.place({
        userId: user?.id || "guest",
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        delivery: `${form.city}, ${form.state}`,
      });
      setOrderId(order.id);
      clear();
      setStep("done");
      toast("Order placed successfully!");
    } catch (err) {
      toast((err as Error).message || "Could not place order", "error");
    } finally {
      setPlacing(false);
    }
  };

  if (step === "done") {
    return (
      <div className="container-hw py-20">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <CheckCircle2 className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold text-charcoal">Order confirmed</h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            Your order <span className="font-semibold text-charcoal">{orderId}</span> has been placed.
            This is a demo — no payment was processed.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {user ? (
              <Link to="/dashboard/orders">
                <Button>Track my orders</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button>Login to track</Button>
              </Link>
            )}
            <Link to="/marketplace">
              <Button variant="outline">Continue shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-hw py-20">
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="Your cart is empty"
          description="Add products from the marketplace to get started."
          action={
            <Link to="/marketplace">
              <Button>Explore marketplace</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="container-hw py-10">
      <h1 className="font-heading text-3xl font-extrabold text-charcoal">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {step === "cart" && (
            <Card className="divide-y divide-charcoal/5">
              {lines.map((line) => (
                <div key={line.productId} className="flex gap-4 p-4">
                  <img
                    src={line.imageUrl}
                    alt={line.productName}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-heading text-sm font-bold text-charcoal">
                      {line.productName}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-primary-dark">
                      {formatCurrency(line.price)}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Select
                        value={String(line.quantity)}
                        onChange={(e) => setQuantity(line.productId, Number(e.target.value))}
                        aria-label="Quantity"
                        className="w-20 py-1.5"
                      >
                        {Array.from({ length: Math.min(line.available || 10, 10) }, (_, i) => i + 1).map(
                          (n) => (
                            <option key={n} value={n}>
                              {n}
                            </option>
                          )
                        )}
                      </Select>
                      <button
                        onClick={() => remove(line.productId)}
                        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-heading text-sm font-bold text-charcoal">
                    {formatCurrency(line.price * line.quantity)}
                  </p>
                </div>
              ))}
            </Card>
          )}

          {step === "details" && (
            <Card className="p-6">
              <h2 className="flex items-center gap-2 font-heading text-lg font-bold text-charcoal">
                <MapPin className="h-5 w-5 text-primary-600" aria-hidden /> Delivery details
              </h2>
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    required
                    value={form.name}
                    error={errors.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    required
                    value={form.email}
                    error={errors.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <Input
                  label="Phone"
                  required
                  value={form.phone}
                  error={errors.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                />
                <Input
                  label="Address"
                  required
                  value={form.address}
                  error={errors.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="City"
                    required
                    value={form.city}
                    error={errors.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                  <Input
                    label="State"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                  />
                  <Input
                    label="PIN code"
                    required
                    value={form.pincode}
                    error={errors.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                  />
                </div>
              </div>

              <h2 className="mt-8 flex items-center gap-2 font-heading text-lg font-bold text-charcoal">
                <Wallet className="h-5 w-5 text-primary-600" aria-hidden /> Payment method
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  { id: "cod", label: "Cash on delivery", desc: "Pay when your order arrives" },
                  { id: "upi", label: "UPI", desc: "Demo — no real payment processed" },
                  { id: "card", label: "Card", desc: "Demo — no real payment processed" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                      payment === opt.id
                        ? "border-primary-400 bg-primary-50"
                        : "border-charcoal/12 hover:border-primary-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.id}
                      checked={payment === opt.id}
                      onChange={() => setPayment(opt.id)}
                      className="accent-primary-600"
                    />
                    <CreditCard className="h-4 w-4 text-charcoal-muted" aria-hidden />
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                      <p className="text-xs text-charcoal-muted">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <Alert tone="info" className="mt-4">
                This is a demonstration checkout. No real payments are processed and no financial
                details are stored.
              </Alert>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-24 p-6">
            <h2 className="font-heading text-lg font-bold text-charcoal">Order summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-charcoal-muted">Subtotal</dt>
                <dd className="font-semibold text-charcoal">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-charcoal-muted">Delivery</dt>
                <dd className="font-semibold text-charcoal">
                  {delivery === 0 ? "Free" : formatCurrency(delivery)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-charcoal/5 pt-2.5 text-base">
                <dt className="font-bold text-charcoal">Total</dt>
                <dd className="font-heading font-extrabold text-primary-dark">
                  {formatCurrency(total)}
                </dd>
              </div>
            </dl>

            {step === "cart" ? (
              <Button fullWidth size="lg" className="mt-6" onClick={() => setStep("details")}>
                Continue to delivery
              </Button>
            ) : (
              <div className="mt-6 space-y-2">
                <Button fullWidth size="lg" loading={placing} onClick={placeOrder}>
                  Place order — {formatCurrency(total)}
                </Button>
                <Button fullWidth variant="subtle" onClick={() => setStep("cart")}>
                  Back to cart
                </Button>
              </div>
            )}
            <p className="mt-4 text-center text-xs text-charcoal-muted">
              Secure demo checkout · No real payment
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}