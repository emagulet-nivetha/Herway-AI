import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-charcoal sm:text-3xl">{title}</h1>
          {description && <p className="mt-1.5 text-sm text-charcoal-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export function DataTable<T>({
  columns,
  rows,
  empty,
  keyField = "id",
}: {
  columns: { key: string; label: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: ReactNode;
  keyField?: string;
}) {
  if (rows.length === 0) {
    return <div>{empty}</div>;
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal/5 bg-white shadow-card scrollbar-thin">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-charcoal/5 bg-cream/60">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-charcoal-muted ${c.className || ""}`}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal/5">
          {rows.map((row, i) => (
            <tr
              key={(row as Record<string, unknown>)[keyField] as string || i}
              className="transition-colors hover:bg-cream/40"
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3.5 align-middle ${c.className || ""}`}>
                  {c.render ? c.render(row) : ((row as Record<string, unknown>)[c.key] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}