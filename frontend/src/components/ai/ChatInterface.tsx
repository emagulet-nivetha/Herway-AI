import { useEffect, useRef, useState } from "react";
import { Bot, Languages, RotateCcw, Send, Sparkles, User as UserIcon } from "lucide-react";
import type { ChatMessage, Language } from "@/types";
import { aiService, AI_DISCLAIMER, LANGUAGES } from "@/services/aiService";
import { AI_SUGGESTED_PROMPTS, AI_TRANSLATIONS } from "@/data/demo-data";
import { Avatar, Badge, Card } from "@/components/ui/Display";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { classNames } from "@/utils/helpers";

function uid() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function ChatInterface({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>("en");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: AI_TRANSLATIONS[language].hello,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || typing) return;
    setInput("");
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);
    try {
      const res = await aiService.chat(content, language);
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: res.text,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: "Sorry, I couldn't respond just now. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const reset = () => {
    setMessages([
      {
        id: uid(),
        role: "assistant",
        content: AI_TRANSLATIONS[language].hello,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <Card className={classNames("flex flex-col overflow-hidden", compact ? "h-[560px]" : "h-[640px]")}>
      <div className="flex items-center gap-3 border-b border-charcoal/5 px-4 py-3.5">
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <Bot className="h-5 w-5" aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-sm font-bold text-charcoal">HerWay AI Assistant</p>
          <p className="text-xs text-secondary-600">Online · guidance for your business</p>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="relative flex items-center">
            <Languages className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-charcoal-muted" aria-hidden />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Assistant language"
              className="rounded-lg border border-charcoal/12 bg-white py-1.5 pl-8 pr-2 text-xs font-medium text-charcoal focus:border-primary-500 focus:outline-none"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={reset}
            aria-label="Reset conversation"
            className="rounded-lg p-2 text-charcoal-muted hover:bg-charcoal/5"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5 scrollbar-thin">
        {messages.map((m) => (
          <div key={m.id} className={classNames("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
            {m.role === "assistant" ? (
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <Bot className="h-4 w-4" aria-hidden />
              </span>
            ) : (
              <Avatar src={user?.avatarUrl} name={user?.name || "You"} size={32} className="shrink-0" />
            )}
            <div
              className={classNames(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "rounded-tr-sm bg-primary-600 text-white"
                  : "rounded-tl-sm bg-cream text-charcoal"
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <Bot className="h-4 w-4" aria-hidden />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-cream px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-charcoal-muted"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="border-t border-charcoal/5 px-4 py-3">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> Suggested prompts
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AI_SUGGESTED_PROMPTS.slice(0, compact ? 3 : 6).map((p) => (
              <button
                key={p}
                onClick={() => send(p)}
                className="rounded-full border border-charcoal/10 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-muted transition-colors hover:border-primary-300 hover:text-primary-dark"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-charcoal/5 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask about products, business, skills, or growth…"
            aria-label="Message"
            className="max-h-28 flex-1 resize-none rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
          <Button type="submit" disabled={!input.trim() || typing} aria-label="Send message" className="px-3.5">
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-2 text-center text-[11px] text-charcoal-muted">{AI_DISCLAIMER}</p>
      </div>
    </Card>
  );
}

export function AIAssistantPublic() {
  return (
    <div>
      <section className="border-b border-charcoal/5 bg-white py-16">
        <div className="container-hw max-w-3xl text-center">
          <Badge tone="primary" className="mx-auto">
            <Sparkles className="h-3 w-3" /> AI Assistant
          </Badge>
          <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Your AI guide for products, business, and growth
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-charcoal-muted">
            Get practical help with product descriptions, pricing, marketing ideas, planning, and
            market research — in English, Tamil, or Hindi.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-hw grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <ChatInterface />

          <div className="space-y-5">
            <Card className="p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold text-charcoal">
                <Sparkles className="h-4 w-4 text-secondary-600" aria-hidden /> What I can help with
              </h2>
              <ul className="mt-3 space-y-2.5 text-sm text-charcoal-muted">
                {[
                  "Product descriptions",
                  "Pricing guidance",
                  "Marketing ideas",
                  "Simple business planning",
                  "Customer communication",
                  "Basic financial education",
                  "Skill development suggestions",
                  "Market research & translation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-amber-50 p-5">
              <h2 className="font-heading text-sm font-bold text-amber-800">
                Important to know
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-amber-800">
                AI output is generated guidance, not verified facts. Always review suggestions before
                acting, and never rely on AI for financial, legal, or lending decisions. HerWay AI
                is not a lending platform.
              </p>
            </Card>

            <Card className="p-5">
              <h2 className="font-heading text-sm font-bold text-charcoal">Multilingual by design</h2>
              <p className="mt-2 text-xs leading-relaxed text-charcoal-muted">
                The assistant currently supports English, Tamil, and Hindi. The architecture allows
                additional Indian languages to be added without changing the app.
              </p>
              <div className="mt-3 flex gap-2">
                {LANGUAGES.map((l) => (
                  <span key={l.code} className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-dark">
                    {l.native}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}