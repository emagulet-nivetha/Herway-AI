import { useState } from "react";
import { Network, Search, Users } from "lucide-react";
import { api } from "@/services/api";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ChartCard, SkillDistributionChart } from "@/components/dashboard/Charts";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Spinner } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";

export function SkillNetwork() {
  const [search, setSearch] = useState("");
  const debounced = useDebounced(search, 250);
  const { data: members, loading } = useAsync(() => api.users.list(), []);
  const { data: analytics } = useAsync(() => api.analytics.summary(), []);

  const list = (members || []).filter((m) => {
    const skills = (m.skills || []).map((s) => s.name).join(" ");
    return (
      m.name.toLowerCase().includes(debounced.toLowerCase()) ||
      skills.toLowerCase().includes(debounced.toLowerCase())
    );
  });

  const roleCounts = (members || []).reduce<Record<string, number>>((acc, m) => {
    (m.skills || []).forEach((s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
    });
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Skill Network"
        description="Discover the skills, roles, and collaboration potential inside your cooperative."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-heading text-base font-bold text-charcoal">Members & skills</h2>
              <div className="relative sm:w-72">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted" aria-hidden />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search members or skills…"
                  aria-label="Search skill network"
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <Spinner label="Loading network…" />
            ) : (
              <ul className="divide-y divide-charcoal/5">
                {list.map((m) => (
                  <li key={m.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar src={m.avatarUrl} name={m.name} size={44} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-charcoal">{m.name}</p>
                        <p className="truncate text-xs text-charcoal-muted">
                          {m.location} · {m.experienceYears ?? 3} yrs experience
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(m.skills && m.skills.length > 0 ? m.skills : [{ id: "x", name: "General", category: "" } as never])
                        .slice(0, 3)
                        .map((s) => (
                          <Badge key={s.id} tone="neutral">{s.name}</Badge>
                        ))}
                    </div>
                  </li>
                ))}
                {list.length === 0 && (
                  <li className="py-8 text-center text-sm text-charcoal-muted">No members match your search.</li>
                )}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <ChartCard title="Skill categories" subtitle="Members per category">
            <SkillDistributionChart data={analytics?.community.skillDistribution ?? []} />
          </ChartCard>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
              <Network className="h-4 w-4 text-primary-600" aria-hidden /> Collaboration groups
            </h2>
            <div className="mt-4 space-y-3">
              {Object.entries(roleCounts).length === 0 ? (
                <p className="text-sm text-charcoal-muted">No skill data yet.</p>
              ) : (
                Object.entries(roleCounts).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between rounded-xl bg-cream px-4 py-3">
                    <span className="flex items-center gap-2 text-sm text-charcoal">
                      <Users className="h-4 w-4 text-primary-500" /> {category || "General"}
                    </span>
                    <span className="font-heading text-sm font-bold text-charcoal">{count}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}