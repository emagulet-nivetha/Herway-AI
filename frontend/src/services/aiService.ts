// ─────────────────────────────────────────────────────────────
// HerWay AI — AI Service Layer
//
// Provider-agnostic abstraction. The frontend never talks to a
// model provider directly. It calls the backend `/api/ai/*` which
// delegates to whichever provider is configured (mock | openai |
// anthropic). This keeps provider-specific logic out of the app
// and lets it be changed entirely via environment variables.
//
//   Frontend → Backend API → AI Service Layer → AI Provider
//
// When no backend is reachable, a local deterministic mock keeps
// every AI feature functional for demos.
// ─────────────────────────────────────────────────────────────

import type { Language } from "@/types";

export type AIFeature =
  | "chat"
  | "product-description"
  | "skill-match"
  | "business-advisor"
  | "translation"
  | "market-insights";

export interface AIRequest {
  feature: AIFeature;
  input: string;
  context?: Record<string, unknown>;
  language?: Language;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  disclaimer?: string;
  provider: string;
  generatedAt: string;
}

const AI_DISCLAIMER =
  "AI suggestions are generated guidance, not verified facts or guaranteed outcomes. Please review before acting.";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";

async function callBackend(req: AIRequest): Promise<AIResponse | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/ai/${req.feature}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("AI request failed");
    return (await res.json()) as AIResponse;
  } catch {
    return null;
  }
}

// ── Local deterministic mock provider ───────────────────────
function mockGenerate(req: AIRequest): AIResponse {
  const input = req.input.trim();
  const lower = input.toLowerCase();
  let text = "";
  let suggestions: string[] = [];

  switch (req.feature) {
    case "product-description":
      text =
        `**${input || "Your product"}**\n\n` +
        `Handcrafted with care by a woman-led enterprise, this piece blends traditional skill with everyday usefulness. Each item is made in small batches, so no two are exactly alike.\n\n` +
        `**Why customers love it**\n` +
        `• Made by hand using quality materials\n` +
        `• Supports a local women's collective\n` +
        `• Thoughtful design that lasts\n\n` +
        `**Care:** Wipe clean, avoid prolonged direct sunlight.`;
      suggestions = ["Add a festive gift option", "Mention your cooperative name", "Add care instructions"];
      break;

    case "skill-match":
      text =
        `Based on the skills and interests you shared, here are collaboration directions worth exploring:\n\n` +
        `**1. Tailoring + Embroidery** — create custom ethnic wear where one member fits and another embellishes.\n` +
        `**2. Food Processing + Digital Marketing** — package local products and promote them online together.\n` +
        `**3. Handicrafts + Photography** — pair makers with someone who can capture product photos.\n\n` +
        `These are suggestions to start a conversation — not guarantees of fit or income.`;
      suggestions = ["Message a suggested match", "Add more skills to your profile", "Set a collaboration goal"];
      break;

    case "business-advisor":
      text =
        `Here's a simple plan to move forward:\n\n` +
        `**1. Product** — Focus on 2–3 bestsellers rather than many items.\n` +
        `**2. Price** — Add up materials, your time, packaging, and a small margin. A simple formula: cost × 1.8.\n` +
        `**3. Customers** — Start with people who already know you, then grow through word of mouth and local markets.\n` +
        `**4. Records** — Log every sale and expense weekly so you know your real profit.\n` +
        `**5. Next step** — Set one small, achievable goal for the next 30 days.`;
      suggestions = ["Create a monthly budget", "Write product descriptions", "Plan a market stall"];
      break;

    case "translation":
      text = `Translation to ${req.language ?? "en"}:\n\n${input}`;
      break;

    case "market-insights":
      text =
        `**Demo market signal (illustrative)**\n\n` +
        `• Handmade textiles and gift sets show steady interest around festival months.\n` +
        `• Eco-friendly home products are growing in urban markets.\n` +
        `• Products with clear photos and honest descriptions sell more reliably.\n\n` +
        `This is an AI-generated pattern from permitted platform data, not a prediction.`;
      break;

    default: {
      if (lower.includes("description")) {
        text = "Sure — share your product name, materials, and what makes it special, and I'll draft a description you can edit.";
      } else if (lower.includes("promote") || lower.includes("marketing") || lower.includes("customers")) {
        text =
          `Here are practical ways to reach more customers:\n\n` +
          `• Post clear, well-lit product photos — natural daylight works best.\n` +
          `• Share your story and the people behind each product.\n` +
          `• Ask happy customers for a short review.\n` +
          `• Work with other members — one can photograph, another can write.\n` +
          `• Start small with one social platform and stay consistent.`;
      } else if (lower.includes("business plan") || lower.includes("plan")) {
        text =
          `A simple business plan has five parts:\n\n` +
          `1. **What you sell** and who it's for.\n` +
          `2. **Your costs** — materials, time, packaging.\n` +
          `3. **Your price** — cover costs plus a fair margin.\n` +
          `4. **How you reach customers** — markets, online, referrals.\n` +
          `5. **A 30-day goal** — one clear, measurable target.`;
      } else if (lower.includes("skill") || lower.includes("learn")) {
        text =
          `Skills that combine well with craft businesses:\n\n` +
          `• **Digital marketing** — to reach customers online.\n` +
          `• **Basic accounting** — to track costs and profit.\n` +
          `• **Photography** — to present products well.\n` +
          `• **Packaging & branding** — to stand out.\n\n` +
          `You can learn many of these free, and pairing with another member is often faster.`;
      } else if (lower.includes("business idea") || lower.includes("idea")) {
        text =
          `Here's an idea based on common craft skills:\n\n` +
          `**Custom festive gift boxes** — combine a handmade textile, a food item, and attractive packaging. Sell as a bundle during festival seasons. It lets several members contribute their specialty and share the profit.`;
      } else {
        text =
          `I'm here to help with your products, business, marketing, skills, and digital growth. Tell me a little about what you make and what you'd like to achieve, and I'll give you practical next steps.`;
      }
      suggestions = [
        "Help me write a product description.",
        "How can I promote my handmade products?",
        "Suggest a business idea using my skills.",
        "Help me create a simple business plan.",
      ];
    }
  }

  return {
    text,
    suggestions,
    disclaimer: AI_DISCLAIMER,
    provider: "mock",
    generatedAt: new Date().toISOString(),
  };
}

export const aiService = {
  async generate(req: AIRequest): Promise<AIResponse> {
    const backend = await callBackend(req);
    if (backend) return backend;
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));
    return mockGenerate(req);
  },

  async chat(message: string, language: Language = "en"): Promise<AIResponse> {
    return this.generate({ feature: "chat", input: message, language });
  },

  async productDescription(input: string, language: Language = "en") {
    return this.generate({ feature: "product-description", input, language });
  },

  async skillMatch(input: string) {
    return this.generate({ feature: "skill-match", input });
  },

  async businessAdvice(input: string, language: Language = "en") {
    return this.generate({ feature: "business-advisor", input, language });
  },

  async translate(text: string, language: Language) {
    return this.generate({ feature: "translation", input: text, language });
  },

  async marketInsights() {
    return this.generate({ feature: "market-insights", input: "" });
  },
};

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

export { AI_DISCLAIMER };