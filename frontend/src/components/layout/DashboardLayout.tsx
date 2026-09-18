import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart3, Bell, Boxes, ClipboardList, FileBarChart, HandCoins, LayoutDashboard,
  LogOut, Menu, Package, PieChart, Settings, ShoppingCart, Sparkles, User as UserIcon,
  Users, Wallet, X,
} from "lucide-react";
import { Logo } from "./Logo";
import { Avatar } from "@/components/ui/Display";
import { useAuth } from "@/context/AuthContext";
import { classNames } from "@/utils/helpers";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

const MEMBER_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" />, end: true },
      { to: "/dashboard/notifications", label: "Notifications", icon: <Bell className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Business",
    items: [
      { to: "/dashboard/products", label: "My Products", icon: <Package className="h-4.5 w-4.5" /> },
      { to: "/dashboard/products/new", label: "Add Product", icon: <Boxes className="h-4.5 w-4.5" /> },
      { to: "/dashboard/orders", label: "Orders", icon: <ShoppingCart className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Finance",
    items: [
      { to: "/dashboard/finance", label: "Financial Records", icon: <Wallet className="h-4.5 w-4.5" /> },
      { to: "/dashboard/finance/savings-loans", label: "Savings & Loans", icon: <HandCoins className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Skills & Community",
    items: [
      { to: "/dashboard/skills", label: "Skill Profile", icon: <Sparkles className="h-4.5 w-4.5" /> },
      { to: "/dashboard/skills/matching", label: "Skill Matching", icon: <Users className="h-4.5 w-4.5" /> },
      { to: "/dashboard/community", label: "Community", icon: <Users className="h-4.5 w-4.5" /> },
      { to: "/dashboard/ai-assistant", label: "AI Assistant", icon: <Sparkles className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Account",
    items: [
      { to: "/dashboard/profile", label: "My Profile", icon: <UserIcon className="h-4.5 w-4.5" /> },
      { to: "/dashboard/settings", label: "Settings", icon: <Settings className="h-4.5 w-4.5" /> },
    ],
  },
];

const COOP_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { to: "/cooperative", label: "Cooperative Dashboard", icon: <LayoutDashboard className="h-4.5 w-4.5" />, end: true },
      { to: "/cooperative/analytics", label: "Analytics", icon: <BarChart3 className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Operations",
    items: [
      { to: "/cooperative/members", label: "Members", icon: <Users className="h-4.5 w-4.5" /> },
      { to: "/cooperative/products", label: "Products", icon: <Package className="h-4.5 w-4.5" /> },
      { to: "/cooperative/orders", label: "Orders", icon: <ShoppingCart className="h-4.5 w-4.5" /> },
      { to: "/cooperative/skills", label: "Skill Network", icon: <Sparkles className="h-4.5 w-4.5" /> },
    ],
  },
  {
    section: "Finance & Reports",
    items: [
      { to: "/cooperative/finance", label: "Financial Overview", icon: <PieChart className="h-4.5 w-4.5" /> },
      { to: "/cooperative/reports", label: "Reports", icon: <FileBarChart className="h-4.5 w-4.5" /> },
      { to: "/cooperative/transactions", label: "Transactions", icon: <ClipboardList className="h-4.5 w-4.5" /> },
    ],
  },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isCoop = user?.role === "cooperative_admin" || user?.role === "platform_admin";
  const nav = isCoop ? COOP_NAV : MEMBER_NAV;

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  if (!user) return null;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-charcoal/5 px-5">
        <Logo size="sm" to={isCoop ? "/cooperative" : "/dashboard"} />
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1.5 text-charcoal-muted hover:bg-charcoal/5 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="border-b border-charcoal/5 px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatarUrl} name={user.name} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-charcoal">{user.name}</p>
            <p className="truncate text-xs capitalize text-charcoal-muted">
              {user.role.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="Dashboard">
        {nav.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-charcoal-muted/70">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      classNames(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-600 text-white shadow-sm"
                          : "text-charcoal-muted hover:bg-primary-50 hover:text-primary-dark"
                      )
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-charcoal/5 p-3">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-charcoal-muted hover:bg-primary-50 hover:text-primary-dark"
        >
          <LayoutDashboard className="h-4.5 w-4.5" /> Public site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4.5 w-4.5" /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-cream-dark">
      <aside className="hidden w-64 shrink-0 border-r border-charcoal/5 bg-white lg:block">
        <div className="sticky top-0 h-screen">{sidebar}</div>
      </aside>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-charcoal/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-hover lg:hidden animate-slide-in-right">
            {sidebar}
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-charcoal/5 bg-white/90 px-4 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-charcoal hover:bg-primary-50"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo size="sm" to={isCoop ? "/cooperative" : "/dashboard"} />
          <div className="ml-auto">
            <Avatar src={user.avatarUrl} name={user.name} size={34} />
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}