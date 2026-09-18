import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin, Users } from "lucide-react";
import { api } from "@/services/api";
import { Badge, Card, SectionHeading, StatCard } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Feedback";
import { FinalCta } from "@/components/home/Previews";
import { useAsync, useCountUp } from "@/hooks/useAsync";

export function CooperativeNetwork() {
  const { data: coops, loading } = useAsync(() => api.cooperatives.list(), []);
  const totalMembers = (coops || []).reduce((s, c) => s + c.members, 0);

  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
              Cooperative Network
            </p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
              Stronger together, digitally connected
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
              Self-Help Groups and cooperatives can manage members, products, finances, and
              analytics from one shared dashboard.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-3">
            <MiniStat label="Cooperatives" value={(coops || []).length} icon={<Building2 className="h-5 w-5" />} />
            <MiniStat label="Members" value={totalMembers} icon={<Users className="h-5 w-5" />} />
            <MiniStat label="Active members" value={(coops || []).reduce((s, c) => s + c.activeMembers, 0)} icon={<Users className="h-5 w-5" />} />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-hw">
          <SectionHeading
            eyebrow="Explore"
            title="Featured cooperatives"
            description="Demo cooperative profiles. Real groups control what is shown publicly."
          />

          {loading ? (
            <Spinner label="Loading cooperatives…" />
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {(coops || []).map((c) => (
                <Card key={c.id} hover className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-dark font-heading text-lg font-bold text-white">
                        {c.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <h2 className="font-heading text-lg font-bold text-charcoal">{c.name}</h2>
                        <p className="flex items-center gap-1 text-xs text-charcoal-muted">
                          <MapPin className="h-3 w-3" aria-hidden /> {c.location}
                        </p>
                      </div>
                    </div>
                    <Badge tone="secondary">{c.type}</Badge>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">{c.description}</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-cream px-4 py-3">
                      <p className="font-heading text-xl font-extrabold text-primary-dark">
                        {c.members}
                      </p>
                      <p className="text-xs text-charcoal-muted">Total members</p>
                    </div>
                    <div className="rounded-xl bg-cream px-4 py-3">
                      <p className="font-heading text-xl font-extrabold text-secondary-600">
                        {c.activeMembers}
                      </p>
                      <p className="text-xs text-charcoal-muted">Active members</p>
                    </div>
                  </div>

                  <Button variant="outline" fullWidth className="mt-5" disabled>
                    Public profile — demo
                  </Button>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-3xl border border-primary-100 bg-primary-50/50 p-8 text-center">
            <h2 className="font-heading text-2xl font-bold text-charcoal">
              Manage a cooperative or SHG?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-charcoal-muted">
              Bring your members, products, and authorized financial records together — with
              role-based access and clear privacy controls.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Register your cooperative
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">Admin login</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  const count = useCountUp(value);
  return <StatCard label={label} value={count} icon={icon} />;
}