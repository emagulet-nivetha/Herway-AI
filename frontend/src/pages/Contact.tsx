import { useState } from "react";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { Input, Textarea, Select } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Feedback";
import { Card, SectionHeading } from "@/components/ui/Display";
import { useToast } from "@/components/ui/Toast";
import { isValidEmail } from "@/utils/helpers";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@herway.demo" },
  { icon: Phone, label: "Phone", value: "+91 90000 00000" },
  { icon: MapPin, label: "Based in", value: "Coimbatore, Tamil Nadu" },
  { icon: MessageSquare, label: "Support hours", value: "Mon–Sat, 9 AM – 6 PM IST" },
];

export function Contact() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", topic: "general", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!isValidEmail(form.email)) e.email = "Please enter a valid email address.";
    if (form.message.trim().length < 10) e.message = "Please enter at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setForm({ name: "", email: "", topic: "general", message: "" });
    toast("Thank you — your message has been received in this demo.");
  };

  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">Contact</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            We'd love to hear from you
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
            Questions, partnerships, or feedback — reach out and our team will respond.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-hw grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-7">
            <SectionHeading eyebrow="" title="Send us a message" align="left" />
            <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Your name"
                  required
                  value={form.name}
                  error={errors.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Lakshmi V."
                />
                <Input
                  label="Email address"
                  type="email"
                  required
                  value={form.email}
                  error={errors.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </div>
              <Select
                label="Topic"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option value="general">General enquiry</option>
                <option value="cooperative">Cooperative onboarding</option>
                <option value="partner">Partnership / support organization</option>
                <option value="technical">Technical issue</option>
                <option value="feedback">Feedback</option>
              </Select>
              <Textarea
                label="Message"
                required
                rows={5}
                value={form.message}
                error={errors.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can help…"
              />
              <Button type="submit" loading={sending} rightIcon={<Send className="h-4 w-4" />}>
                Send message
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium text-charcoal-muted">{label}</p>
                  <p className="text-sm font-semibold text-charcoal">{value}</p>
                </div>
              </Card>
            ))}
            <Alert tone="info" title="Demo platform">
              This is a demonstration deployment. Contact details and message delivery are simulated.
            </Alert>
          </div>
        </div>
      </section>
    </div>
  );
}