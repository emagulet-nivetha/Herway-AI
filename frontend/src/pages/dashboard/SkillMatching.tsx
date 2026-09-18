import { useState } from "react";
import { MapPin, Send, Sparkles, Users } from "lucide-react";
import type { MatchSuggestion } from "@/types";
import { api } from "@/services/api";
import { aiService } from "@/services/aiService";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Modal, Spinner } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { useAsync } from "@/hooks/useAsync";

export function SkillMatching() {
  const toast = useToast();
  const { data: matches, loading } = useAsync(() => api.matches.list(), []);
  const [requestTarget, setRequestTarget] = useState<MatchSuggestion | null>(null);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const runAi = async () => {
    setAiLoading(true);
    const res = await aiService.skillMatch(
      aiInput || "I want to find complementary skills for my craft business"
    );
    setAiOutput(res.text);
    setAiLoading(false);
  };

  return (
    <div>
      <PageHeader
        title="Skill Matching"
        description="AI-assisted suggestions for women with complementary skills."
        actions={
          <Button
            variant="secondary"
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={() => setAiOpen(true)}
          >
            AI skill matcher
          </Button>
        }
      />

      {loading ? (
        <Spinner label="Finding matches…" />
      ) : (matches || []).length === 0 ? (
        <EmptyState icon={<Users className="h-6 w-6" />} title="No matches yet" description="Add more skills to your profile." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {(matches || []).map((m) => (
            <Card key={m.id} hover className="flex flex-col p-5">
              <div className="flex items-start gap-3">
                <Avatar src={m.avatarUrl} name={m.userName} size={48} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-sm font-bold text-charcoal">{m.userName}</h3>
                    <span className="shrink-0 rounded-full bg-secondary-50 px-2 py-0.5 text-xs font-bold text-secondary-600">
                      {m.matchScore}%
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-charcoal-muted">
                    <MapPin className="h-3 w-3" aria-hidden /> {m.location}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.skills.map((s) => (
                  <span key={s} className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-dark">
                    {s}
                  </span>
                ))}
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-400">
                  Seeks: {m.interest}
                </span>
              </div>

              <p className="mt-3 flex-1 rounded-xl bg-cream px-3.5 py-3 text-xs leading-relaxed text-charcoal-light">
                {m.opportunity}
              </p>

              <Button
                size="sm"
                variant="outline"
                fullWidth
                className="mt-4"
                leftIcon={<Send className="h-3.5 w-3.5" />}
                onClick={() => setRequestTarget(m)}
              >
                Request collaboration
              </Button>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 text-center text-xs text-charcoal-muted">
        Match scores are experimental AI recommendations — not guaranteed outcomes.
      </p>

      <Modal
        open={Boolean(requestTarget)}
        onClose={() => setRequestTarget(null)}
        title={`Request collaboration with ${requestTarget?.userName ?? ""}`}
        footer={
          <>
            <Button variant="subtle" onClick={() => setRequestTarget(null)}>Cancel</Button>
            <Button
              leftIcon={<Send className="h-4 w-4" />}
              onClick={() => {
                toast(`Collaboration request sent to ${requestTarget?.userName} (demo)`);
                setRequestTarget(null);
              }}
            >
              Send request
            </Button>
          </>
        }
      >
        <textarea
          rows={4}
          defaultValue={`Hi ${requestTarget?.userName?.split(" ")[0] ?? ""}, I'd love to explore a collaboration. ${requestTarget?.opportunity ?? ""}`}
          className="w-full rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        <p className="mt-3 text-xs text-charcoal-muted">
          Your request will notify the member directly in the live platform.
        </p>
      </Modal>

      <Modal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI skill matcher"
        size="lg"
        footer={
          <>
            <Button variant="subtle" onClick={() => setAiOpen(false)}>Close</Button>
            <Button onClick={runAi} loading={aiLoading} leftIcon={<Sparkles className="h-4 w-4" />}>
              Get suggestions
            </Button>
          </>
        }
      >
        <Input
          label="What are you looking for?"
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          placeholder="e.g. I need someone who can help market my products online"
        />
        {aiOutput && (
          <div className="mt-4 whitespace-pre-wrap rounded-xl bg-cream p-4 text-sm leading-relaxed text-charcoal-light">
            {aiOutput}
          </div>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-xs text-amber-700">
          <Badge tone="warning">AI guidance</Badge> Suggestions are not verified facts or guarantees.
        </p>
      </Modal>
    </div>
  );
}