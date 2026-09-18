import { useState } from "react";
import { Award, Plus, Sparkles, Trash2, Users } from "lucide-react";
import type { UserSkill } from "@/types";
import { api } from "@/services/api";
import { aiService } from "@/services/aiService";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { Modal, Spinner } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Form";
import { useAsync } from "@/hooks/useAsync";
import { SKILL_LIST } from "@/data/demo-data";
import { classNames } from "@/utils/helpers";

const LEVELS: UserSkill["level"][] = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function SkillProfile() {
  const toast = useToast();
  const { data: skills, loading, setData } = useAsync(() => api.users.skills(), []);
  const [addOpen, setAddOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [form, setForm] = useState({ skillName: SKILL_LIST[0], level: "Intermediate" as UserSkill["level"], years: "1" });

  const addSkill = async () => {
    const skill: UserSkill = {
      id: "",
      skillId: `sk-${Date.now()}`,
      skillName: form.skillName,
      category: "General",
      level: form.level,
      years: Number(form.years),
    };
    const created = await api.users.addSkill(skill);
    setData((prev) => [...(prev || []), created]);
    setAddOpen(false);
    toast("Skill added to your profile");
  };

  const removeSkill = (id: string) => {
    setData((prev) => (prev || []).filter((s) => s.id !== id));
    toast("Skill removed", "info");
  };

  const getFeedback = async () => {
    setLoadingFeedback(true);
    const list = (skills || []).map((s) => `${s.skillName} (${s.level})`).join(", ");
    const res = await aiService.businessAdvice(
      `I have these skills: ${list}. What should I learn next to grow my business?`
    );
    setFeedback(res.text);
    setLoadingFeedback(false);
  };

  return (
    <div>
      <PageHeader
        title="Skill Profile"
        description="Add your skills so the AI can suggest collaborations and learning paths."
        actions={
          <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddOpen(true)}>
            Add skill
          </Button>
        }
      />

      {loading ? (
        <Spinner label="Loading skills…" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
                <Award className="h-4 w-4 text-primary-600" aria-hidden /> My skills
              </h3>
              <div className="mt-5 space-y-3">
                {(skills || []).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-4 rounded-xl border border-charcoal/8 p-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <Sparkles className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-charcoal">{s.skillName}</p>
                      <p className="text-xs text-charcoal-muted">
                        {s.years} year{s.years === 1 ? "" : "s"} experience
                      </p>
                    </div>
                    <Badge
                      tone={
                        s.level === "Expert"
                          ? "primary"
                          : s.level === "Advanced"
                          ? "secondary"
                          : "neutral"
                      }
                    >
                      {s.level}
                    </Badge>
                    <button
                      onClick={() => removeSkill(s.id)}
                      aria-label={`Remove ${s.skillName}`}
                      className="rounded-lg p-2 text-charcoal-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {(skills || []).length === 0 && (
                  <p className="py-8 text-center text-sm text-charcoal-muted">
                    No skills added yet. Add your first skill to get matches.
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="bg-primary-50/50 p-5">
              <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-charcoal">
                <Sparkles className="h-4 w-4 text-secondary-600" aria-hidden /> AI skill advisor
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-charcoal-muted">
                Get suggestions on which skills to learn next to grow your business.
              </p>
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                className="mt-4"
                onClick={() => {
                  getFeedback();
                  setFeedbackOpen(true);
                }}
              >
                Get suggestions
              </Button>
            </Card>

            <Card className="p-5">
              <h3 className="flex items-center gap-2 font-heading text-sm font-bold text-charcoal">
                <Users className="h-4 w-4 text-primary-600" aria-hidden /> Skill categories
              </h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Clothing", "Handicrafts", "Food", "Agriculture", "Digital", "Beauty", "Services"].map(
                  (c) => (
                    <span
                      key={c}
                      className="rounded-full border border-charcoal/10 px-2.5 py-1 text-xs font-medium text-charcoal-muted"
                    >
                      {c}
                    </span>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a skill"
        footer={
          <>
            <Button variant="subtle" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={addSkill}>Add skill</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Skill</label>
            <Select value={form.skillName} onChange={(e) => setForm({ ...form, skillName: e.target.value })}>
              {SKILL_LIST.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal">Experience level</label>
            <div className="grid grid-cols-2 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setForm({ ...form, level: l })}
                  className={classNames(
                    "rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors",
                    form.level === l
                      ? "border-primary-400 bg-primary-50 text-primary-dark"
                      : "border-charcoal/12 text-charcoal-muted hover:border-primary-200"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Input
            label="Years of experience"
            type="number"
            min={0}
            value={form.years}
            onChange={(e) => setForm({ ...form, years: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        title="AI skill suggestions"
        footer={<Button onClick={() => setFeedbackOpen(false)}>Close</Button>}
      >
        {loadingFeedback ? (
          <Spinner label="Thinking…" className="py-8" />
        ) : (
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-charcoal-light">
            {feedback}
          </div>
        )}
        <p className="mt-4 text-xs text-amber-700">
          AI-generated suggestions are guidance, not verified facts.
        </p>
      </Modal>
    </div>
  );
}