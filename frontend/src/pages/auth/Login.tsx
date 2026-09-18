import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { useAuth } from "@/context/AuthContext";
import { DEMO_LOGIN } from "@/services/api";
import { isValidEmail } from "@/utils/helpers";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!isValidEmail(form.email)) errs.email = "Enter a valid email address.";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setServerError("");
    try {
      const user = await login(form);
      const dest =
        from ||
        (user.role === "member" ? "/dashboard" : "/cooperative");
      navigate(dest, { replace: true });
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm(DEMO_LOGIN);

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your products, finances, skills, and opportunities."
      footer={
        <>
          New to HerWay AI?{" "}
          <Link to="/signup" className="font-semibold text-primary-dark hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        {serverError && <Alert tone="error">{serverError}</Alert>}

        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-charcoal-muted" aria-hidden />
          <Input
            label="Email address"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-charcoal-muted" aria-hidden />
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            required
            autoComplete="current-password"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            className="pl-10 pr-11"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="absolute right-3 top-[38px] rounded-lg p-1.5 text-charcoal-muted hover:bg-charcoal/5"
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/forgot-password" className="text-sm font-medium text-primary-dark hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={loading}>
          Log in
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-primary-200 bg-primary-50/50 p-4">
        <p className="text-xs font-semibold text-primary-dark">Demo access</p>
        <p className="mt-1 text-xs text-charcoal-muted">
          Email: <span className="font-mono">{DEMO_LOGIN.email}</span>
          <br />
          Password: <span className="font-mono">{DEMO_LOGIN.password}</span>
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={fillDemo}>
          Fill demo credentials
        </Button>
      </div>
    </AuthShell>
  );
}