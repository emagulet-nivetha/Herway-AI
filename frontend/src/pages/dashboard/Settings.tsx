import { useState } from "react";
import { Globe, Lock, ShieldCheck, Trash2, User as UserIcon, Bell } from "lucide-react";
import type { Language } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Alert, Modal } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { classNames } from "@/utils/helpers";

export function Settings() {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    skillMatches: true,
    financialReminders: true,
    productTips: false,
    emailDigest: true,
  });
  const [language, setLanguage] = useState<Language>(user?.languages?.[0] || "en");

  if (!user) return null;

  return (
    <div>
      <PageHeader title="Settings" description="Manage your account, privacy, and preferences." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <UserIcon className="h-4 w-4 text-primary-600" aria-hidden /> Account
          </h2>
          <div className="mt-5 space-y-4">
            <Input label="Full name" defaultValue={user.name} />
            <Input label="Email" type="email" defaultValue={user.email} />
            <Input label="Phone" defaultValue={user.phone || ""} />
            <div className="flex justify-end">
              <Button onClick={() => toast("Account details saved")}>Save changes</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Globe className="h-4 w-4 text-primary-600" aria-hidden /> Language & region
          </h2>
          <div className="mt-5 space-y-4">
            <Select
              label="Preferred language"
              value={language}
              onChange={(e) => {
                const lang = e.target.value as Language;
                setLanguage(lang);
                updateUser({ languages: [lang] });
                toast("Language preference updated");
              }}
            >
              <option value="en">English</option>
              <option value="ta">Tamil (தமிழ்)</option>
              <option value="hi">Hindi (हिन्दी)</option>
            </Select>
            <p className="text-xs text-charcoal-muted">
              More Indian languages can be added over time. The AI assistant follows this preference.
            </p>
            <Select label="State" defaultValue={user.location.split(",").slice(-1)[0]?.trim()}>
              <option>Tamil Nadu</option>
              <option>Kerala</option>
              <option>Karnataka</option>
              <option>Rajasthan</option>
              <option>Maharashtra</option>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Bell className="h-4 w-4 text-primary-600" aria-hidden /> Notification preferences
          </h2>
          <div className="mt-5 space-y-3">
            {(
              [
                { key: "orderUpdates", label: "Order updates" },
                { key: "skillMatches", label: "New skill matches" },
                { key: "financialReminders", label: "Financial reminders" },
                { key: "productTips", label: "Product & marketing tips" },
                { key: "emailDigest", label: "Weekly email digest" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.key}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-charcoal/8 px-4 py-3 hover:border-primary-300"
              >
                <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={prefs[opt.key]}
                  aria-label={opt.label}
                  onClick={() => setPrefs({ ...prefs, [opt.key]: !prefs[opt.key] })}
                  className={classNames(
                    "relative h-6 w-11 rounded-full transition-colors",
                    prefs[opt.key] ? "bg-primary-600" : "bg-charcoal/15"
                  )}
                >
                  <span
                    className={classNames(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      prefs[opt.key] ? "translate-x-[22px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
            <Lock className="h-4 w-4 text-primary-600" aria-hidden /> Privacy & security
          </h2>
          <div className="mt-5 space-y-4">
            <Input label="Current password" type="password" placeholder="••••••••" />
            <Input label="New password" type="password" placeholder="••••••••" />
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => toast("Password update requested (demo)")}>
                Update password
              </Button>
            </div>
          </div>
          <div className="mt-6 border-t border-charcoal/5 pt-5">
            <Alert tone="info" title="Your data, your control">
              <span className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                Financial records are private by default. Consent preferences are managed from the
                Financial Records page.
              </span>
            </Alert>
          </div>
        </Card>

        <Card className="border-red-100 p-6 lg:col-span-2">
          <h2 className="font-heading text-base font-bold text-red-700">Danger zone</h2>
          <p className="mt-2 text-sm text-charcoal-muted">
            Deleting your account removes your profile, products, and records from the platform. This
            cannot be undone.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="subtle" onClick={logout}>Log out</Button>
            <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />} onClick={() => setDeleteOpen(true)}>
              Delete account
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete account?"
        size="sm"
        footer={
          <>
            <Button variant="subtle" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteOpen(false);
                toast("Account deletion is disabled in this demo", "info");
              }}
            >
              Yes, delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-charcoal-muted">
          This is a demonstration. Account deletion is disabled so you can keep exploring the demo.
        </p>
      </Modal>
    </div>
  );
}