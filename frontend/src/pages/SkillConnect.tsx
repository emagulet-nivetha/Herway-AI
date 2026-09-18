import { useMemo, useState } from "react";
import {
  CheckCircle2, MapPin, Plus, Search, Send, Sparkles, UserCheck, Users,
} from "lucide-react";
import type { MatchSuggestion } from "@/types";
import { api } from "@/services/api";
import { SKILL_LIST } from "@/data/demo-data";
import { aiService } from "@/services/aiService";
import { Avatar, Badge, Card, SectionHeading } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Modal, Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { classNames } from "@/utils/helpers";

export function SkillConnect() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [requestModal, setRequestModal] = useState<MatchSuggestion | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");

  const debounced = useDebounced(search, 250);
  const { data: matches, loading } = useAsync(() => api.matches.list(), []);
  const { data: skills } = useAsync(() => api.users.skills(), []);

  const filtered = useMemo(() => {
    let list = matches || [];
    if (debounced) {
      const q = debounced.toLowerCase();
      list = list.filter(
        (m) =>
          m.userName.toLowerCase().includes(q) ||
          m.skills.some((s) => s.toLowerCase().includes(q)) ||
          m.interest.toLowerCase().includes(q)
      );
    }
    return list;
  }, [matches, debounced]);

  const runAiMatch = async () => {
    setAiLoading(true);
    const res = await aiService.skillMatch(
      aiInput || "I do tailoring and embroidery, looking to collaborate"
    );
    setAiOutput(res.text);
    setAiLoading(false);
  };

  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-secondary-600">
              Skill Connect
            </p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
              Your Skills Can Meet Her Skills.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
              Create a skill profile, discover women with complementary skills, and build something
              together.
            </p>
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
                aria-hidden
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search skills, interests, or names…"
                aria-label="Search skill matches"
                className="pl-10"
              />
            </div>
            <Select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Experience level" className="sm:w-44">
              <option value="all">All levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </Select>
            <Button
              variant="secondary"
              leftIcon={<Sparkles className="h-4 w-4" />}
              onClick={() => setAiModalOpen(true)}
            >
              AI Match
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-hw grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-xl font-bold text-charcoal">
                Suggested collaborators
              </h2>
              <Badge tone="neutral">Experimental matches · demo data</Badge>
            </div>

            {loading ? (
              <Spinner label="Finding matches…" />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No matches found"
                description="Try a different skill or clear the search."
                action={<Button onClick={() => setSearch("")}>Clear search</Button>}
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filtered.map((m) => (
                  <Card key={m.id} hover className="flex flex-col p-5">
                    <div className="flex items-start gap-4">
                      <Avatar src={m.avatarUrl} name={m.userName} size={52} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-heading text-base font-bold text-charcoal">
                            {m.userName}
                          </h3>
                          <span className="shrink-0 rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-bold text-secondary-600">
                            {m.matchScore}%
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-muted">
                          <MapPin className="h-3 w-3" aria-hidden /> {m.location}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {m.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-dark"
                        >
                          {s}
                        </span>
                      ))}
                      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-400">
                        Seeks: {m.interest}
                      </span>
                    </div>

                    <p className="mt-4 flex-1 rounded-xl bg-cream px-3.5 py-3 text-xs leading-relaxed text-charcoal-light">
                      <Sparkles className="mb-1 h-3.5 w-3.5 text-secondary-600" aria-hidden />
                      {m.opportunity}
                    </p>

                    <Button
                      size="sm"
                      variant="outline"
                      fullWidth
                      className="mt-4"
                      leftIcon={<Send className="h-3.5 w-3.5" />}
                      onClick={() => setRequestModal(m)}
                    >
                      Send collaboration request
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            <p className="mt-6 text-center text-xs text-charcoal-muted">
              Match scores are experimental AI recommendations, not guarantees of collaboration or
              business outcomes.
            </p>
          </div>

          <aside className="space-y-5">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
                <UserCheck className="h-4.5 w-4.5 text-primary-600" aria-hidden /> My skills
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(skills || []).map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-dark"
                  >
                    {s.skillName} · {s.level}
                  </span>
                ))}
              </div>
              <Button
                variant="subtle"
                fullWidth
                size="sm"
                className="mt-4"
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                onClick={() =>
                  toast(
                    user ? "Manage skills from your dashboard" : "Login to add skills to your profile",
                    "info"
                  )
                }
              >
                Add a skill
              </Button>
            </Card>

            <Card className="p-5">
              <h2 className="font-heading text-base font-bold text-charcoal">Explore skills</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SKILL_LIST.slice(0, 14).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSearch(s)}
                    className="rounded-full border border-charcoal/10 px-2.5 py-1 text-xs font-medium text-charcoal-muted transition-colors hover:border-primary-300 hover:text-primary-dark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-primary-50/50 p-5">
              <h2 className="font-heading text-base font-bold text-charcoal">How matching works</h2>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-charcoal-muted">
                <li>1. Add skills and collaboration interests to your profile.</li>
                <li>2. The AI looks for complementary skills and needs.</li>
                <li>3. You review suggestions and send a request.</li>
                <li>4. Collaborate directly — you're always in control.</li>
              </ul>
            </Card>
          </aside>
        </div>
      </section>

      <Modal
        open={Boolean(requestModal)}
        onClose={() => setRequestModal(null)}
        title={`Collaborate with ${requestModal?.userName ?? ""}`}
        footer={
          <>
            <Button variant="subtle" onClick={() => setRequestModal(null)}>
              Cancel
            </Button>
            <Button
              leftIcon={<Send className="h-4 w-4" />}
              onClick={() => {
                toast(`Collaboration request sent to ${requestModal?.userName} (demo)`);
                setRequestModal(null);
              }}
            >
              Send request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-cream p-4">
            <Avatar src={requestModal?.avatarUrl} name={requestModal?.userName ?? ""} size={44} />
            <div>
              <p className="text-sm font-semibold text-charcoal">{requestModal?.userName}</p>
              <p className="text-xs text-charcoal-muted">{requestModal?.location}</p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">
              Your collaboration idea
            </label>
            <textarea
              rows={4}
              defaultValue={`Hi ${requestModal?.userName?.split(" ")[0] ?? ""}, I'd love to explore a collaboration. ${
                requestModal?.opportunity ?? ""
              }`}
              className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <p className="text-xs text-charcoal-muted">
            This is a demo request. In the live platform it would notify the member directly.
          </p>
        </div>
      </Modal>

      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        title="AI Skill Matcher"
        size="lg"
        footer={
          <>
            <Button variant="subtle" onClick={() => setAiModalOpen(false)}>
              Close
            </Button>
            <Button onClick={runAiMatch} loading={aiLoading} leftIcon={<Sparkles className="h-4 w-4" />}>
              Get suggestions
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Describe your skills and what you're looking for"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="e.g. I do tailoring and want to add embroidery to my products"
          />
          <div
            className={classNames(
              "rounded-xl border border-charcoal/8 bg-cream p-4 text-sm leading-relaxed",
              !aiOutput && "text-charcoal-muted"
            )}
          >
            {aiLoading ? (
              <span className="flex items-center gap-2 text-charcoal-muted">
                <Sparkles className="h-4 w-4 animate-pulse-soft text-secondary-600" />
                Finding collaboration ideas…
              </span>
            ) : aiOutput ? (
              <div className="whitespace-pre-wrap">{aiOutput}</div>
            ) : (
              "Share your skills and the matcher will suggest collaboration directions. You can also add skills to your dashboard profile for better suggestions."
            )}
          </div>
          {aiOutput && (
            <p className="flex items-start gap-2 text-xs text-amber-700">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              AI-generated suggestions are guidance, not verified facts or guaranteed opportunities.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}