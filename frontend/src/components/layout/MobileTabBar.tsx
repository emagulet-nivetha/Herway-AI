import { NavLink } from "react-router-dom";
import { Home, ShoppingBag, Sparkles, Users, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { classNames } from "@/utils/helpers";

const items = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/marketplace", label: "Market", icon: ShoppingBag },
  { to: "/skill-connect", label: "Skills", icon: Users },
  { to: "/ai-assistant", label: "AI", icon: Sparkles },
];

export function MobileTabBar() {
  const { user } = useAuth();
  const profilePath = user ? "/dashboard/profile" : "/login";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-white/95 backdrop-blur-md lg:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              classNames(
                "flex min-w-[64px] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold",
                isActive ? "text-primary-600" : "text-charcoal-muted"
              )
            }
          >
            <Icon className="h-5 w-5" aria-hidden />
            {label}
          </NavLink>
        ))}
        <NavLink
          to={profilePath}
          className={({ isActive }) =>
            classNames(
              "flex min-w-[64px] flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold",
              isActive ? "text-primary-600" : "text-charcoal-muted"
            )
          }
        >
          <UserIcon className="h-5 w-5" aria-hidden />
          Profile
        </NavLink>
      </div>
    </nav>
  );
}