import { env } from "../config/env";
import { prisma } from "../config/prisma";

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
  language?: string;
  userId?: string;
}

export interface AIResponse {
  text: string;
  suggestions?: string[];
  disclaimer: string;
  provider: string;
  generatedAt: string;
}

const AI_DISCLAIMER =
  "AI suggestions are generated guidance, not verified facts or guaranteed outcomes. Please review before acting.";

const SYSTEM_PROMPT = `You are HerWay AI, a practical business assistant for women-led
Self-Help Groups, artisans, and micro-entrepreneurs in India.
Give clear, culturally-aware, actionable guidance. Never promise income, loan
approval, or credit scores. Keep answers concise and encouraging.`;

function mockGenerate(req: AIRequest): AIResponse {
  const input = req.input.trim();
  const lower = input.toLowerCase();
  let text = "";
  let suggestions: string[] = [];

  switch (req.feature) {
    case "product-description":
      text =
        `${input || "Your product"} is handcrafted with care by a woman-led enterprise, ` +
        `blending traditional skill with everyday usefulness. Made in small batches, so no two pieces are exactly alike.\n\n` +
        `Why customers love it:\n• Handmade using quality materials\n• Supports a local women's collective\n• Thoughtful design that lasts`;
      suggestions = ["Add a festive gift option", "Mention your cooperative name", "Add care instructions"];
      break;
    case "skill-match":
      text =
        `Based on the skills and interests shared, here are collaboration directions worth exploring:\n\n` +
        `1. Tailoring + Embroidery\n2. Food Processing + Digital Marketing\n3. Handicrafts + Photography\n\n` +
        `These are suggestions to start a conversation — not guarantees of fit or income.`;
      suggestions = ["Message a suggested match", "Add more skills to your profile", "Set a collaboration goal"];
      break;
    case "business-advisor":
      text =
        `A simple plan to move forward:\n\n1. Product — focus on 2-3 bestsellers.\n` +
        `2. Price — add materials, time, packaging, and a small margin (cost × 1.8).\n` +
        `3. Customers — start with people who know you, then local markets and word of mouth.\n` +
        `4. Records — log every sale and expense weekly.\n5. Next step — set one small 30-day goal.`;
      suggestions = ["Create a monthly budget", "Write product descriptions", "Plan a market stall"];
      break;
    case "translation":
      text = `Translation to ${req.language ?? "en"}:\n\n${input}`;
      break;
    case "market-insights":
      text =
        `Demo market signal (illustrative):\n\n• Handmade textiles and gift sets see steady interest around festivals.\n` +
        `• Eco-friendly home products are growing in urban markets.\n• Clear photos and honest descriptions sell more reliably.\n\n` +
        `This is an AI-generated pattern from permitted platform data, not a prediction.`;
      break;
    default:
      if (lower.includes("description")) {
        text = "Share your product name, materials, and what makes it special, and I'll draft a description you can edit.";
      } else if (lower.includes("promote") || lower.includes("marketing") || lower.includes("customer")) {
        text =
          `Practical ways to reach more customers:\n\n• Post clear, well-lit product photos.\n• Share your story.\n` +
          `• Ask happy customers for a review.\n• Collaborate with other members.\n• Start with one social platform and stay consistent.`;
      } else if (lower.includes("plan")) {
        text =
          `A simple business plan has five parts:\n1. What you sell and who it's for.\n2. Your costs.\n` +
          `3. Your price.\n4. How you reach customers.\n5. A 30-day goal.`;
      } else if (lower.includes("skill") || lower.includes("learn")) {
        text =
          `Skills that combine well with craft businesses: Digital marketing, basic accounting, ` +
          `photography, and packaging & branding. Pairing with another member is often faster.`;
      } else if (lower.includes("idea")) {
        text =
          `Idea: Custom festive gift boxes — combine a handmade textile, a food item, and attractive packaging. ` +
          `Sell as a bundle during festival seasons so several members can contribute their specialty.`;
      } else {
        text =
          `I'm here to help with your products, business, marketing, skills, and digital growth. ` +
          `Tell me what you make and what you'd like to achieve, and I'll give practical next steps.`;
      }
      suggestions = [
        "Help me write a product description.",
        "How can I promote my handmade products?",
        "Suggest a business idea using my skills.",
        "Help me create a simple business plan.",
      ];
  }

  return { text, suggestions, disclaimer: AI_DISCLAIMER, provider: "mock", generatedAt: new Date().toISOString() };
}

async function callOpenAI(req: AIRequest): Promise<AIResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.aiTimeoutMs);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: env.aiModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `[${req.feature}] ${req.input}${req.language ? ` (reply in ${req.language})` : ""}` },
        ],
        temperature: 0.6,
        max_tokens: 700,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI request failed (${res.status})`);
    const data = (await res.json()) as { choices: { message: { content: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    return { text, disclaimer: AI_DISCLAIMER, provider: "openai", generatedAt: new Date().toISOString() };
  } finally {
    clearTimeout(timeout);
  }
}

async function callAnthropic(req: AIRequest): Promise<AIResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.aiTimeoutMs);
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.anthropicApiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: env.aiModel || "claude-3-5-sonnet-latest",
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: `[${req.feature}] ${req.input}` }],
      }),
    });
    if (!res.ok) throw new Error(`Anthropic request failed (${res.status})`);
    const data = (await res.json()) as { content: { text: string }[] };
    const text = data.content?.map((c) => c.text).join("").trim() || "";
    return { text, disclaimer: AI_DISCLAIMER, provider: "anthropic", generatedAt: new Date().toISOString() };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Generate an AI response using the configured provider. Falls back to the
 * deterministic mock provider when a provider is unavailable, so AI features
 * never hard-fail during a demo.
 */
export async function generateAI(req: AIRequest): Promise<AIResponse> {
  let response: AIResponse;
  try {
    if (env.aiProvider === "openai" && env.openaiApiKey) {
      response = await callOpenAI(req);
    } else if (env.aiProvider === "anthropic" && env.anthropicApiKey) {
      response = await callAnthropic(req);
    } else {
      response = mockGenerate(req);
    }
  } catch (err) {
    console.warn("[HerWay] AI provider failed, using mock:", (err as Error).message);
    response = mockGenerate(req);
  }

  // Best-effort persistence for auditability — never block the response.
  try {
    await prisma.aIRecommendation.create({
      data: {
        userId: req.userId ?? null,
        feature: req.feature,
        input: req.input.slice(0, 2000),
        output: response.text.slice(0, 4000),
        provider: response.provider,
      },
    });
  } catch {
    /* ignore persistence failures (e.g. DB offline) */
  }

  return response;
}

export { AI_DISCLAIMER };
