import { classNames } from "@/utils/helpers";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export function Tabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Section tabs"
      className={classNames(
        "flex gap-1 overflow-x-auto rounded-xl border border-charcoal/10 bg-white p-1 scrollbar-thin",
        className
      )}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={classNames(
              "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              selected
                ? "bg-primary-600 text-white shadow-sm"
                : "text-charcoal-muted hover:bg-primary-50 hover:text-primary-dark"
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={classNames(
                  "rounded-full px-1.5 text-xs",
                  selected ? "bg-white/20" : "bg-charcoal/5"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}