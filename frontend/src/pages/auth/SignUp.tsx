import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, MapPin, Phone, User as UserIcon } from "lucide-react";
import type { Language, UserRole } from "@/types";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { INDIAN_STATES, classNames, isValidEmail, passwordStrength } from "@/utils/helpers";

const LANG_OPTIONS: { code: Language; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
];

export function SignUp() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialRole = (location.state as { role?: UserRole } | null)?.role || "member";

  const { data: coops } = useAsync(() => api.cooperatives.list(), []);

  const [role, setRole] = useState<UserRole>(initialRole);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    location: "",
    state: "Tamil Nadu",
    cooperativeId: "",
  });
  const [languages, setLanguages] = useState<Language[]>(["en"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(form.password);

  const toggleLang = (code: Language) =>
    setLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address.";
    if (form.password.length < 8) errs.password = "Use at least 8 characters.";
    if (strength.score < 2) errs.password = "Password is too weak. Add numbers or symbols.";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match.";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\D/g, "")))
      errs.phone = "Enter a 10-digit phone number.";
    if (!form.location.trim()) errs.location = "Please enter your town or city.";
    if (languages.length === 0) errs.languages = "Select at least one language.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setServerError("");
    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
        phone: form.phone || undefined,
        location: `${form.location}, ${form.state}`,
        languages,
        cooperativeId: form.cooperativeId || undefined,
      });
      navigate(user.role === "member" ? "/dashboard" : "/cooperative", { replace: true });
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Join HerWay AI"
      subtitle="Create your profile and start connecting, creating, and growing."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary-dark hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError && <Alert tone="error">{serverError}</Alert>}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">I am joining as</label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { id: "member", label: "Member", icon: UserIcon },
                { id: "cooperative_admin", label: "Cooperative Admin", icon: Building2 },
              ] as const
            ).map((r) => {
              const Icon = r.icon;
              const active = role === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  aria-pressed={active}
                  className={classNames(
                    "flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-semibold transition-all",
                    active
                      ? "border-primary-400 bg-primary-50 text-primary-dark"
                      : "border-charcoal/12 text-charcoal-muted hover:border-primary-200"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Full name"
          required
          value={form.name}
          error={errors.name}
          autoComplete="name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Lakshmi Venkatesan"
        />

        <Input
          label="Email address"
          type="email"
          required
          value={form.email}
          error={errors.email}
          autoComplete="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />

        <Input
          label="Phone number"
          value={form.phone}
          error={errors.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="10-digit mobile number"
          hint="Optional — used only for order and account updates."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Town / City"
            required
            value={form.location}
            error={errors.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="e.g. Coimbatore"
          />
          <Select
            label="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>

        {role === "member" && (
          <Select
            label="Join a cooperative (optional)"
            value={form.cooperativeId}
            onChange={(e) => setForm({ ...form, cooperativeId: e.target.value })}
          >
            <option value="">Not part of a cooperative yet</option>
            {(coops || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.location}
              </option>
            ))}
          </Select>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-charcoal">
            Languages you speak
          </label>
          <div className="flex flex-wrap gap-2">
            {LANG_OPTIONS.map((l) => (
              <button
                type="button"
                key={l.code}
                onClick={() => toggleLang(l.code)}
                aria-pressed={languages.includes(l.code)}
                className={classNames(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                  languages.includes(l.code)
                    ? "border-primary-400 bg-primary-50 text-primary-dark"
                    : "border-charcoal/12 text-charcoal-muted hover:border-primary-200"
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
          {errors.languages && <p className="mt-1 text-xs font-medium text-red-600">{errors.languages}</p>}
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            required
            value={form.password}
            error={errors.password}
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 8 characters"
            className="pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-[38px] rounded-lg p-1.5 text-charcoal-muted hover:bg-charcoal/5"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-1.5 flex-1 gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={classNames(
                      "h-full flex-1 rounded-full",
                      i < strength.score
                        ? strength.score >= 3
                          ? "bg-green-500"
                          : "bg-amber-400"
                        : "bg-charcoal/10"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-charcoal-muted">{strength.label}</span>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type={showPw ? "text" : "password"}
          required
          value={form.confirm}
          error={errors.confirm}
          autoComplete="new-password"
          onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          placeholder="Re-enter your password"
        />

        <label className="flex items-start gap-2.5 text-xs text-charcoal-muted">
          <input type="checkbox" required className="mt-0.5 accent-primary-600" />
          <span>
            I agree to the{" "}
            <Link to="/terms" className="font-semibold text-primary-dark hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="font-semibold text-primary-dark hover:underline">
              Privacy Policy
            </Link>
            . I understand HerWay AI is not a lending platform.
          </span>
        </label>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Create my account
        </Button>
      </form>
    </AuthShell>
  );
}