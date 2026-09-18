import { Bell, Check, HandCoins, ShoppingCart, Sparkles, Users } from "lucide-react";
import type { Notification } from "@/types";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Spinner } from "@/components/ui/Feedback";
import { useAsync } from "@/hooks/useAsync";
import { classNames, relativeTime } from "@/utils/helpers";

const ICONS = {
  order: ShoppingCart,
  match: Users,
  finance: HandCoins,
  message: Bell,
  system: Sparkles,
};

export function Notifications() {
  const { user } = useAuth();
  const toast = useToast();
  const { data, loading, setData, reload } = useAsync(
    () => api.notifications.list(user?.id || ""),
    [user?.id]
  );

  const notifications = data || [];
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (n: Notification) => {
    await api.notifications.markRead(n.id);
    setData((prev) => (prev || []).map((x) => (x.id === n.id ? { ...x, read: true } : x)));
  };

  const markAllRead = async () => {
    await Promise.all(notifications.filter((n) => !n.read).map((n) => api.notifications.markRead(n.id)));
    reload();
    toast("All notifications marked as read");
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unread > 0 ? `You have ${unread} unread notification${unread === 1 ? "" : "s"}.` : "You're all caught up."}
        actions={
          unread > 0 ? (
            <Button variant="outline" leftIcon={<Check className="h-4 w-4" />} onClick={markAllRead}>
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {loading ? (
        <Spinner label="Loading notifications…" />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-6 w-6" />}
          title="No notifications"
          description="Order updates, skill matches, and financial reminders will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <Card
                key={n.id}
                className={classNames(
                  "flex items-start gap-4 p-4 transition-colors",
                  !n.read && "border-primary-200 bg-primary-50/40"
                )}
              >
                <span
                  className={classNames(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    n.read ? "bg-charcoal/5 text-charcoal-muted" : "bg-primary-100 text-primary-600"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-charcoal">{n.title}</p>
                    {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-600" aria-label="Unread" />}
                  </div>
                  <p className="mt-1 text-sm text-charcoal-muted">{n.body}</p>
                  <p className="mt-1.5 text-xs text-charcoal-muted">{relativeTime(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n)}
                    className="shrink-0 rounded-lg p-2 text-charcoal-muted hover:bg-white"
                    aria-label="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}