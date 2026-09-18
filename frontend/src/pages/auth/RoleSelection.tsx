import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Check, ShieldCheck, User } from "lucide-react";
import type { UserRole } from "@/types";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { classNames } from "@/utils/helpers";

const ROLES: {
  id: UserRole;
  title: string;
  icon: typeof User;
  description: string;
  points: string[];
}[] = [
  {
    id: "member",
    title: "Member",
    icon: User,
    description: "For SHG members, artisans, and women entrepreneurs.",
    points: [
      "Manage your profile and skills",
      "Add and sell products",
      "View your own financial records",
      "Connect and use the AI assistant",
    ],
  },
  {
    id: "cooperative_admin",
    title: "Cooperative Admin",
    icon: Building2,
    description: "For SHGs and cooperatives managing a group.",
    points: [
      "Manage cooperative members",
      "Approve and manage products",
      "Maintain authorized financial records",
      "View cooperative analytics and reports",
    ],
  },
  {
    id: "platform_admin",
    title: "Platform Admin",
    icon: ShieldCheck,
    description: "For HerWay platform operators.",
    points: [
      "Manage platform users",
      "Manage categories",
      "Moderate content",
      "Monitor system activity",
    ],
  },
];

export function RoleSelection() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<UserRole>("member");

  const confirm = () => {
    if (user) updateUser({ role: selected });
    navigate("/signup", { state: { role: selected }, replace: true });
  };

  return (
    <AuthShell
      title="Choose your role"
      subtitle="Select how you'll use HerWay AI. You can update this later from Settings."
    >
      <div className="space-y-3">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const active = selected === role.id;
          return (
            <button
              key={role.id}
              onClick={() => setSelected(role.id)}
              aria-pressed={active}
              className={classNames(
                "w-full rounded-2xl border p-5 text-left transition-all",
                active
                  ? "border-primary-400 bg-primary-50/60 shadow-card"
                  : "border-charcoal/10 bg-white hover:border-primary-200"
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={classNames(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    active ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-600"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-heading text-base font-bold text-charcoal">{role.title}</h3>
                    {active && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-charcoal-muted">{role.description}</p>
                  <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {role.points.map((p) => (
                      <li key={p} className="flex items-start gap-1.5 text-xs text-charcoal-light">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-secondary-600" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button fullWidth size="lg" className="mt-6" onClick={confirm} rightIcon={<ArrowRight className="h-4 w-4" />}>
        Continue as {ROLES.find((r) => r.id === selected)?.title}
      </Button>
    </AuthShell>
  );
}