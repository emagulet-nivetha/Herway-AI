import { useEffect, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from "lucide-react";
import { classNames } from "@/utils/helpers";
import { Button } from "./Button";

export function Spinner({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div className={classNames("flex flex-col items-center justify-center gap-3 py-16", className)}>
      <Loader2 className="h-7 w-7 animate-spin text-primary-600" aria-hidden />
      <p className="text-sm text-charcoal-muted">{label}</p>
    </div>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
  onClose,
}: {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  onClose?: () => void;
}) {
  const tones = {
    info: { wrap: "border-secondary-200 bg-secondary-50 text-secondary-600", Icon: Info },
    success: { wrap: "border-green-200 bg-green-50 text-green-700", Icon: CheckCircle2 },
    warning: { wrap: "border-amber-200 bg-amber-50 text-amber-700", Icon: AlertTriangle },
    error: { wrap: "border-red-200 bg-red-50 text-red-700", Icon: XCircle },
  };
  const { wrap, Icon } = tones[tone];
  return (
    <div
      role="alert"
      className={classNames("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", wrap)}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className={title ? "mt-0.5" : undefined}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal/15 bg-white/60 px-6 py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
          {icon}
        </div>
      )}
      <h3 className="font-heading text-lg font-semibold text-charcoal">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-charcoal-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={classNames(
          "relative z-10 w-full rounded-t-2xl bg-white shadow-hover sm:rounded-2xl",
          widths[size]
        )}
      >
        <div className="flex items-center justify-between border-b border-charcoal/5 px-5 py-4">
          <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-charcoal-muted hover:bg-charcoal/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 scrollbar-thin">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-charcoal/5 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="subtle" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-charcoal-muted">{message}</p>
    </Modal>
  );
}