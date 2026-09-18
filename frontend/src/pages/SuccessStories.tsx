import { Badge, Card, SectionHeading } from "@/components/ui/Display";
import { FinalCta } from "@/components/home/Previews";
import { DEMO_STORIES } from "@/data/demo-data";
import { Quote } from "lucide-react";

export function SuccessStories() {
  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
            Success Stories
          </p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Journeys of connection and growth
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
            These are clearly labelled demonstration stories. Real, verified stories would be
            contributed by platform users with their consent.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-hw space-y-8">
          {DEMO_STORIES.map((story, i) => (
            <Card key={story.id} className="overflow-hidden">
              <div className={`grid gap-0 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative min-h-[240px] overflow-hidden">
                  <img
                    src={story.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <Badge tone="neutral" className="absolute left-4 top-4 bg-white/90">
                    Illustrative demo
                  </Badge>
                </div>
                <div className="p-7 lg:p-9">
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-600">
                    {story.group} · {story.location}
                  </p>
                  <h2 className="mt-3 font-heading text-2xl font-bold text-charcoal">
                    {story.title}
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-charcoal-muted">{story.summary}</p>

                  <div className="mt-6 flex items-center gap-4 rounded-xl bg-cream px-5 py-4">
                    <p className="font-heading text-3xl font-extrabold text-primary-dark">
                      {story.stat}
                    </p>
                    <p className="text-sm text-charcoal-muted">{story.statLabel}</p>
                  </div>

                  <blockquote className="mt-6 flex items-start gap-3 border-l-2 border-rose-400 pl-4">
                    <Quote className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden />
                    <p className="text-sm italic leading-relaxed text-charcoal-light">
                      {story.quote}
                      <span className="mt-2 block text-xs not-italic text-charcoal-muted">
                        — {story.member} (demo)
                      </span>
                    </p>
                  </blockquote>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <FinalCta />
    </div>
  );
}