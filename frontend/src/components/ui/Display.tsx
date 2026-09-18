import type { ReactNode } from "react";
import { Star } from "lucide-react";
import { classNames, initials } from "@/utils/helpers";

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={classNames(
        "rounded-2xl border border-charcoal/5 bg-white shadow-card",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "rose" | "neutral" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-dark",
    secondary: "bg-secondary-50 text-secondary-600",
    rose: "bg-rose-100 text-rose-400",
    neutral: "bg-charcoal/5 text-charcoal-light",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  src,
  name,
  size = 40,
  className,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
}) {
  return src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={classNames("rounded-full object-cover", className)}
      style={{ width: size, height: size }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  ) : (
    <div
      aria-hidden
      className={classNames(
        "flex items-center justify-center rounded-full bg-primary-100 font-heading font-semibold text-primary-dark",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(name)}
    </div>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${value} out of 5`}>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
      <span className="text-xs font-semibold text-charcoal">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-xs text-charcoal-muted">({count})</span>}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-secondary-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold leading-tight text-charcoal sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-charcoal-muted">{description}</p>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  tone = "primary",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  tone?: "primary" | "secondary" | "amber" | "rose";
}) {
  const tones = {
    primary: "bg-primary-50 text-primary-600",
    secondary: "bg-secondary-50 text-secondary-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-100 text-rose-400",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-charcoal-muted">{label}</p>
          <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{value}</p>
          {trend && (
            <p
              className={classNames(
                "mt-1 text-xs font-semibold",
                trend.positive ? "text-green-600" : "text-charcoal-muted"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <span className={classNames("flex h-10 w-10 items-center justify-center rounded-xl", tones[tone])}>
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}