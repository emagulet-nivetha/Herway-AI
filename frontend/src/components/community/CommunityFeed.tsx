import { useMemo, useState } from "react";
import {
  Award, Heart, HelpCircle, Lightbulb, MessageCircle, Plus, Search, Send, Flag, Calendar,
} from "lucide-react";
import type { Post } from "@/types";
import { api } from "@/services/api";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { EmptyState, Modal, Spinner } from "@/components/ui/Feedback";
import { Input } from "@/components/ui/Form";
import { useAsync, useDebounced } from "@/hooks/useAsync";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { classNames, relativeTime } from "@/utils/helpers";

const TYPE_META = {
  achievement: { label: "Achievement", icon: Award, tone: "primary" as const },
  question: { label: "Question", icon: HelpCircle, tone: "secondary" as const },
  opportunity: { label: "Opportunity", icon: Lightbulb, tone: "rose" as const },
  workshop: { label: "Workshop", icon: Calendar, tone: "warning" as const },
  post: { label: "Post", icon: MessageCircle, tone: "neutral" as const },
};

export function CommunityFeed({ heading = true }: { heading?: boolean }) {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState("");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [draftTags, setDraftTags] = useState("");
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [reportPost, setReportPost] = useState<Post | null>(null);

  const debounced = useDebounced(search, 250);
  const { data, loading, setData, reload } = useAsync(
    () => api.community.posts(debounced),
    [debounced]
  );
  const posts = useMemo(() => data || [], [data]);

  const updatePost = (post: Post) =>
    setData((prev) => (prev || []).map((p) => (p.id === post.id ? post : p)));

  const toggleLike = async (post: Post) => {
    const updated = await api.community.like(post.id);
    updatePost(updated);
  };

  const submitComment = async (postId: string) => {
    const content = (commentDrafts[postId] || "").trim();
    if (!content) return;
    if (!user) {
      toast("Please login to comment", "info");
      return;
    }
    const updated = await api.community.comment(postId, {
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      content,
    });
    updatePost(updated);
    setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
  };

  const createPost = async () => {
    if (draft.trim().length < 5) {
      toast("Please write a little more before posting", "error");
      return;
    }
    if (!user) {
      toast("Please login to post", "info");
      return;
    }
    const post = await api.community.createPost({
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatarUrl,
      content: draft.trim(),
      tags: draftTags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    });
    setData((prev) => [post, ...(prev || [])]);
    setDraft("");
    setDraftTags("");
    setComposerOpen(false);
    toast("Your post is live in the community");
  };

  return (
    <div>
      {heading && (
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-extrabold text-charcoal sm:text-4xl">
            Community
          </h1>
          <p className="mt-2 text-sm text-charcoal-muted">
            A safe space to share achievements, ask questions, find collaborators, and post
            opportunities.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div>
          <Card className="mb-5 p-4">
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatarUrl} name={user?.name || "Guest"} size={40} />
              <button
                onClick={() => (user ? setComposerOpen(true) : toast("Please login to post", "info"))}
                className="flex-1 rounded-xl border border-charcoal/12 bg-cream px-4 py-2.5 text-left text-sm text-charcoal-muted hover:border-primary-300"
              >
                Share an achievement, question, or opportunity…
              </button>
              <Button
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => (user ? setComposerOpen(true) : toast("Please login to post", "info"))}
                className="hidden sm:inline-flex"
              >
                Post
              </Button>
            </div>
          </Card>

          <div className="relative mb-5">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-muted"
              aria-hidden
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts, tags, or members…"
              aria-label="Search community"
              className="pl-10"
            />
          </div>

          {loading ? (
            <Spinner label="Loading community…" />
          ) : posts.length === 0 ? (
            <EmptyState
              icon={<MessageCircle className="h-6 w-6" />}
              title="No posts found"
              description={search ? "Try a different search term." : "Be the first to post."}
              action={search ? <Button onClick={() => setSearch("")}>Clear search</Button> : undefined}
            />
          ) : (
            <div className="space-y-5">
              {posts.map((post) => {
                const meta = TYPE_META[post.type] ?? TYPE_META.post;
                const Icon = meta.icon;
                return (
                  <Card key={post.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={post.authorAvatar} name={post.authorName} size={42} />
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{post.authorName}</p>
                          <p className="text-xs text-charcoal-muted">{relativeTime(post.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={meta.tone}>
                          <Icon className="h-3 w-3" /> {meta.label}
                        </Badge>
                        <button
                          onClick={() => setReportPost(post)}
                          aria-label="Report post"
                          className="rounded-lg p-1.5 text-charcoal-muted hover:bg-charcoal/5"
                        >
                          <Flag className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-charcoal-light">
                      {post.content}
                    </p>

                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((t) => (
                          <button
                            key={t}
                            onClick={() => setSearch(t)}
                            className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-dark hover:bg-primary-100"
                          >
                            #{t}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-4 border-t border-charcoal/5 pt-3">
                      <button
                        onClick={() => toggleLike(post)}
                        aria-pressed={post.likedByMe}
                        className={classNames(
                          "flex items-center gap-1.5 text-xs font-semibold transition-colors",
                          post.likedByMe ? "text-rose-400" : "text-charcoal-muted hover:text-rose-400"
                        )}
                      >
                        <Heart className={classNames("h-4 w-4", post.likedByMe && "fill-rose-400")} />
                        {post.likes}
                      </button>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted">
                        <MessageCircle className="h-4 w-4" /> {post.comments.length}
                      </span>
                    </div>

                    {post.comments.length > 0 && (
                      <div className="mt-3 space-y-3 border-t border-charcoal/5 pt-3">
                        {post.comments.map((c) => (
                          <div key={c.id} className="flex gap-2.5">
                            <Avatar src={c.authorAvatar} name={c.authorName} size={30} />
                            <div className="rounded-xl bg-cream px-3.5 py-2">
                              <p className="text-xs font-semibold text-charcoal">{c.authorName}</p>
                              <p className="text-sm text-charcoal-light">{c.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <Avatar src={user?.avatarUrl} name={user?.name || "You"} size={30} />
                      <input
                        value={commentDrafts[post.id] || ""}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && submitComment(post.id)}
                        placeholder="Write a comment…"
                        aria-label="Write a comment"
                        className="flex-1 rounded-full border border-charcoal/12 bg-white px-4 py-2 text-sm focus:border-primary-500 focus:outline-none"
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        aria-label="Send comment"
                        className="rounded-full bg-primary-600 p-2 text-white hover:bg-primary-dark"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <Card className="p-5">
            <h2 className="font-heading text-sm font-bold text-charcoal">Community guidelines</h2>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-charcoal-muted">
              <li>Be kind and respectful to every member.</li>
              <li>No harassment, discrimination, or hate speech.</li>
              <li>Keep financial details private.</li>
              <li>No spam or misleading claims.</li>
              <li>Report content that breaks these rules.</li>
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="font-heading text-sm font-bold text-charcoal">Popular tags</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["achievement", "collaboration", "marketing", "tip", "opportunity", "workshop", "finance", "baking"].map(
                (t) => (
                  <button
                    key={t}
                    onClick={() => setSearch(t)}
                    className="rounded-full border border-charcoal/10 px-2.5 py-1 text-xs font-medium text-charcoal-muted hover:border-primary-300 hover:text-primary-dark"
                  >
                    #{t}
                  </button>
                )
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-heading text-sm font-bold text-charcoal">Moderation</h2>
            <p className="mt-2 text-xs leading-relaxed text-charcoal-muted">
              Every post can be reported. Administrators review reports and can remove content that
              violates guidelines.
            </p>
          </Card>
        </aside>
      </div>

      <Modal
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        title="Create a post"
        footer={
          <>
            <Button variant="subtle" onClick={() => setComposerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createPost} leftIcon={<Send className="h-4 w-4" />}>
              Publish
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatarUrl} name={user?.name || "You"} size={40} />
            <p className="text-sm font-semibold text-charcoal">{user?.name}</p>
          </div>
          <textarea
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Share an achievement, ask a question, or post an opportunity…"
            className="w-full rounded-xl border border-charcoal/15 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <Input
            label="Tags (comma separated)"
            value={draftTags}
            onChange={(e) => setDraftTags(e.target.value)}
            placeholder="achievement, collaboration"
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(reportPost)}
        onClose={() => setReportPost(null)}
        title="Report this post"
        size="sm"
        footer={
          <>
            <Button variant="subtle" onClick={() => setReportPost(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                toast("Report submitted — our moderators will review it.", "info");
                setReportPost(null);
              }}
            >
              Submit report
            </Button>
          </>
        }
      >
        <p className="text-sm text-charcoal-muted">
          Reports are confidential. Our moderation team reviews reported content and takes action
          where guidelines are broken.
        </p>
      </Modal>
    </div>
  );
}

export function Community() {
  return (
    <div className="container-hw py-10">
      <CommunityFeed />
    </div>
  );
}