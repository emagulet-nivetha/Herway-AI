import { Link } from "react-router-dom";
import { classNames } from "@/utils/helpers";

export function Logo({
  size = "md",
  to = "/",
  light = false,
}: {
  size?: "sm" | "md" | "lg";
  to?: string;
  light?: boolean;
}) {
  const dims = {
    sm: { box: "h-8 w-8", text: "text-base", mark: 18 },
    md: { box: "h-9 w-9", text: "text-lg", mark: 20 },
    lg: { box: "h-11 w-11", text: "text-xl", mark: 24 },
  }[size];

  return (
    <Link
      to={to}
      className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      aria-label="HerWay AI home"
    >
      <span
        className={classNames(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-dark shadow-sm",
          dims.box
        )}
      >
        <svg
          width={dims.mark}
          height={dims.mark}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path d="M7 5.5v13l10-6.5-10-6.5z" fill="#FFF9F4" />
          <circle cx="16.5" cy="12.5" r="3.2" fill="#168C87" />
          <circle cx="13.4" cy="15.4" r="3.2" fill="#E9A7B8" fillOpacity="0.92" />
        </svg>
      </span>
      <span className={classNames("font-heading font-bold tracking-tight", dims.text)}>
        <span className={light ? "text-white" : "text-charcoal"}>HerWay</span>
        <span className={light ? "text-rose-300" : "text-primary-600"}> AI</span>
      </span>
    </Link>
  );
}