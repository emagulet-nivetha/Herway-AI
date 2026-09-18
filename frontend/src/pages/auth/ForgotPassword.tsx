import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { isValidEmail } from "@/utils/helpers";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell title="Check your email" subtitle="If an account exists, a reset link is on its way.">
        <Alert tone="success" title="Reset link sent">
          We've sent password reset instructions to <strong>{email}</strong>. In this demo, no email
          is actually sent.
        </Alert>
        <div className="mt-6 flex flex-col gap-3">
          <Link to="/login">
            <Button fullWidth>Back to login</Button>
          </Link>
          <Button variant="subtle" fullWidth onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a link to reset it."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary-dark hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="relative">
          <MailCheck className="pointer-events-none absolute left-3.5 top-[42px] h-4 w-4 text-charcoal-muted" aria-hidden />
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            error={error}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="pl-10"
          />
        </div>
        <Button type="submit" fullWidth size="lg" loading={loading}>
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}