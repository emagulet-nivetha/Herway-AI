import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Bell, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, ShoppingBag, Sparkles, User as UserIcon, X,
} from "lucide-react";
import { Logo } from "./Logo";
import { Avatar } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { classNames } from "@/utils/helpers";

const PUBLIC_LINKS = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/skill-connect", label: "Skill Connect" },
  { to: "/community", label: "Community" },
  { to: "/how-it-works", label: "How It Works" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dashboardPath =
    user?.role === "platform_admin" || user?.role === "cooperative_admin"
      ? "/cooperative"
      : "/dashboard";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/5 bg-cream/90 backdrop-blur-md">
      <nav className="container-hw flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {PUBLIC_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                classNames(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-dark"
                    : "text-charcoal-muted hover:bg-primary-50/60 hover:text-primary-dark"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/marketplace"
            className="relative hidden rounded-lg p-2.5 text-charcoal-muted hover:bg-primary-50 hover:text-primary-dark sm:block"
            aria-label={`Cart${count ? `, ${count} items` : ""}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-400 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-primary-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <Avatar src={user.avatarUrl} name={user.name} size={34} />
                <span className="hidden max-w-[110px] truncate text-sm font-semibold text-charcoal sm:block">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-charcoal-muted sm:block" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-charcoal/5 bg-white py-2 shadow-hover animate-fade-in"
                >
                  <div className="border-b border-charcoal/5 px-4 pb-3 pt-1">
                    <p className="truncate text-sm font-semibold text-charcoal">{user.name}</p>
                    <p className="truncate text-xs text-charcoal-muted">{user.email}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-dark">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                  <MenuLink to={dashboardPath} icon={<LayoutDashboard className="h-4 w-4" />} label="Dashboard" />
                  <MenuLink to="/dashboard/profile" icon={<UserIcon className="h-4 w-4" />} label="My Profile" />
                  <MenuLink to="/marketplace" icon={<ShoppingBag className="h-4 w-4" />} label="Marketplace" />
                  <MenuLink to="/dashboard/wishlist" icon={<Heart className="h-4 w-4" />} label="Wishlist" />
                  <MenuLink to="/dashboard/notifications" icon={<Bell className="h-4 w-4" />} label="Notifications" />
                  <MenuLink to="/dashboard/ai-assistant" icon={<Sparkles className="h-4 w-4" />} label="AI Assistant" />
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 border-t border-charcoal/5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Join HerWay</Button>
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2.5 text-charcoal hover:bg-primary-50 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-charcoal/5 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {PUBLIC_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  classNames(
                    "rounded-lg px-4 py-3 text-sm font-semibold",
                    isActive ? "bg-primary-50 text-primary-dark" : "text-charcoal-muted"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          {!isAuthenticated && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/login">
                <Button variant="outline" fullWidth>Login</Button>
              </Link>
              <Link to="/signup">
                <Button fullWidth>Join HerWay</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function MenuLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      to={to}
      role="menuitem"
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-primary-50 hover:text-primary-dark"
    >
      {icon}
      {label}
    </Link>
  );
}