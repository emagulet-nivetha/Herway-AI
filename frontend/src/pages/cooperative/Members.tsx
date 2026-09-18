import { useState } from "react";
import { BadgeCheck, Mail, Search, UserPlus, UserX } from "lucide-react";
import type { User } from "@/types";
import { api } from "@/services/api";
import { useToast } from "@/components/ui/Toast";
import { PageHeader, DataTable } from "@/components/dashboard/PageHeader";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Modal, Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { formatDate, isValidEmail } from "@/utils/helpers";

export function Members() {
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const debounced = useDebounced(search, 250);

  const { data, loading, setData } = useAsync(() => api.users.list(), []);

  const members = (data || []).filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(debounced.toLowerCase()) ||
      m.location.toLowerCase().includes(debounced.toLowerCase());
    const matchesFilter =
      filter === "all" ? true : filter === "verified" ? m.verified : !m.verified;
    return matchesSearch && matchesFilter;
  });

  const toggleVerify = async (m: User) => {
    const updated = await api.users.update(m.id, { verified: !m.verified });
    setData((prev) => (prev || []).map((u) => (u.id === updated.id ? updated : u)));
    toast(`${m.name} ${m.verified ? "un-verified" : "verified"}`);
  };

  const addMember = async () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Required";
    if (!isValidEmail(form.email)) e.email = "Valid email required";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setAddOpen(false);
    setForm({ name: "", email: "", phone: "", location: "" });
    toast(`Invitation sent to ${form.email} (demo)`);
  };

  return (
    <div>
      <PageHeader
        title="Members"
        description="Manage cooperative members, verify profiles, and control roles."
        actions={
          <Button leftIcon={<UserPlus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
            Add member
          </Button>
        }
      />

      <Card className="mb-5 flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or location…"
            aria-label="Search members"
            className="pl-10"
          />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-48" aria-label="Filter">
          <option value="all">All members</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending verification</option>
        </Select>
      </Card>

      {loading ? (
        <Spinner label="Loading members…" />
      ) : (
        <DataTable<User>
          rows={members}
          columns={[
            {
              key: "name",
              label: "Member",
              render: (m) => (
                <div className="flex items-center gap-3">
                  <Avatar src={m.avatarUrl} name={m.name} size={40} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-charcoal">{m.name}</p>
                    <p className="truncate text-xs text-charcoal-muted">{m.email}</p>
                  </div>
                </div>
              ),
            },
            { key: "location", label: "Location", render: (m) => <span className="text-charcoal-muted">{m.location}</span> },
            { key: "role", label: "Role", render: (m) => <Badge tone="neutral">{m.role.replace("_", " ")}</Badge> },
            { key: "joinedAt", label: "Joined", render: (m) => <span className="text-charcoal-muted">{formatDate(m.joinedAt)}</span> },
            {
              key: "verified",
              label: "Status",
              render: (m) =>
                m.verified ? (
                  <Badge tone="success"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
                ) : (
                  <Badge tone="warning">Pending</Badge>
                ),
            },
            {
              key: "actions",
              label: "",
              className: "text-right",
              render: (m) => (
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleVerify(m)}>
                    {m.verified ? "Un-verify" : "Verify"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-2 text-red-600 hover:bg-red-50"
                    aria-label={`Remove ${m.name}`}
                    onClick={() => toast("Removing members is restricted in the demo", "info")}
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a member"
        footer={
          <>
            <Button variant="subtle" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addMember} loading={busy} leftIcon={<Mail className="h-4 w-4" />}>
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" required value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Town / City" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <p className="text-xs text-charcoal-muted">
            Members receive an invitation to join your cooperative. This is a demo — no email is sent.
          </p>
        </div>
      </Modal>
    </div>
  );
}