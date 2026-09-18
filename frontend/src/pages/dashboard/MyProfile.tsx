import { useState } from "react";
import {
  Award, BadgeCheck, Building2, Globe, MapPin, Package, Pencil, Sparkles, Users,
} from "lucide-react";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { INDIAN_STATES, formatDate } from "@/utils/helpers";

const JOURNEY = [
  { label: "Profile Created", done: true },
  { label: "Skills Added", done: true },
  { label: "Product Added", done: true },
  { label: "First Order", done: true },
  { label: "Collaboration", done: false },
  { label: "Growth Milestone", done: false },
];

export function MyProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const { data: skills } = useAsync(() => api.users.skills(), []);
  const { data: products } = useAsync(
    () => api.products.list({ sellerId: user?.id }),
    [user?.id]
  );

  if (!user) return null;

  const [form, setForm] = useState({
    name: user.name,
    location: user.location,
    bio: user.bio || "",
    phone: user.phone || "",
  });

  const save = async () => {
    const updated = await api.users.update(user.id, form);
    updateUser(updated);
    setEditing(false);
    toast("Profile updated");
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Your public profile and digital journey on HerWay AI."
        actions={
          <Button variant="outline" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditing(true)}>
            Edit profile
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar src={user.avatarUrl} name={user.name} size={96} />
            <div className="mt-4 flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-charcoal">{user.name}</h2>
              {user.verified && <BadgeCheck className="h-5 w-5 text-secondary-600" aria-label="Verified" />}
            </div>
            <p className="text-sm text-charcoal-muted">{user.role.replace("_", " ")}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {user.verified ? (
                <Badge tone="success">Verified profile</Badge>
              ) : (
                <Badge tone="warning">Verification pending</Badge>
              )}
              <Badge tone="neutral">Joined {formatDate(user.joinedAt)}</Badge>
            </div>
          </div>

          <dl className="mt-6 space-y-3 border-t border-charcoal/5 pt-5 text-sm">
            <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={user.location} />
            {user.cooperative && (
              <Row icon={<Building2 className="h-4 w-4" />} label="Cooperative" value={user.cooperative} />
            )}
            <Row
              icon={<Globe className="h-4 w-4" />}
              label="Languages"
              value={user.languages.map((l) => ({ en: "English", ta: "Tamil", hi: "Hindi" }[l])).join(", ")}
            />
            <Row
              icon={<Award className="h-4 w-4" />}
              label="Experience"
              value={`${user.experienceYears ?? 0} years`}
            />
          </dl>

          {user.bio && (
            <p className="mt-5 border-t border-charcoal/5 pt-5 text-sm leading-relaxed text-charcoal-muted">
              {user.bio}
            </p>
          )}
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Sparkles className="h-4 w-4 text-primary-600" aria-hidden /> My Digital Journey
            </h3>
            <div className="mt-6">
              <ol className="relative space-y-6 border-l-2 border-primary-100 pl-6">
                {JOURNEY.map((step) => (
                  <li key={step.label} className="relative">
                    <span
                      className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        step.done
                          ? "border-primary-600 bg-primary-600 text-white"
                          : "border-charcoal/20 bg-white"
                      }`}
                    >
                      {step.done && <BadgeCheck className="h-3.5 w-3.5" />}
                    </span>
                    <p className={`text-sm font-semibold ${step.done ? "text-charcoal" : "text-charcoal-muted"}`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-charcoal-muted">
                      {step.done ? "Completed" : "Not yet started"}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Users className="h-4 w-4 text-primary-600" aria-hidden /> Skills
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {(skills || []).map((s) => (
                <span
                  key={s.id}
                  className="rounded-full bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-dark"
                >
                  {s.skillName} · {s.level}
                </span>
              ))}
            </div>

            <h3 className="mt-6 flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Sparkles className="h-4 w-4 text-rose-400" aria-hidden /> Collaboration interests
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(user.collaborationInterests || []).map((c) => (
                <span key={c} className="rounded-full bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-400">
                  {c}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Package className="h-4 w-4 text-primary-600" aria-hidden /> Products
              <span className="text-sm font-normal text-charcoal-muted">({(products || []).length})</span>
            </h3>
            {(products || []).length === 0 ? (
              <p className="mt-3 text-sm text-charcoal-muted">No products listed yet.</p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(products || []).slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-charcoal/8 p-3">
                    <img src={p.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-charcoal">{p.name}</p>
                      <p className="text-xs text-charcoal-muted">₹{p.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {(user.achievements || []).length > 0 && (
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
                <Award className="h-4 w-4 text-amber-500" aria-hidden /> Achievements
              </h3>
              <ul className="mt-4 space-y-2">
                {(user.achievements || []).map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-sm text-charcoal-light">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Award className="h-3.5 w-3.5" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit profile"
        footer={
          <>
            <Button variant="subtle" onClick={() => setEditing(false)}>Cancel</Button>
            <Button onClick={save}>Save changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Town / City" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Select label="State" defaultValue="Tamil Nadu">
            {INDIAN_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Textarea
            label="Short bio"
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell customers and collaborators about your work…"
          />
        </div>
      </Modal>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-primary-600">{icon}</span>
      <div>
        <dt className="text-xs text-charcoal-muted">{label}</dt>
        <dd className="font-medium text-charcoal">{value}</dd>
      </div>
    </div>
  );
}