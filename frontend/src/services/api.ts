import { mockApi, getSession, resetMockDB } from "./mockApi";

// ─────────────────────────────────────────────────────────────
// Unified API layer.
//
// By default HerWay AI runs against a fully-featured mock service
// layer so the whole platform is explorable with demo data. Set
// VITE_API_URL (e.g. http://localhost:5000/api) to route requests
// to the real Express/PostgreSQL backend instead.
//
// Components only ever import from this module, so switching the
// data source is a one-line environment change.
// ─────────────────────────────────────────────────────────────

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) || "";

export const USING_REAL_API = Boolean(API_URL);

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (!API_URL) return null;
  const session = getSession();
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || `Request failed (${res.status})`);
    }
    return (await res.json()) as T;
  } catch (err) {
    if ((err as Error).message?.includes("Request failed")) throw err;
    // Network error → fall through to mock so the demo keeps working.
    if (import.meta.env.DEV) {
      console.warn(`[HerWay] API unreachable at ${path}, using demo data.`);
    }
    return null;
  }
}

export const api = {
  auth: {
    async login(input: Parameters<typeof mockApi.auth.login>[0]): Promise<Awaited<ReturnType<typeof mockApi.auth.login>>> {
      const real = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return (real as Awaited<ReturnType<typeof mockApi.auth.login>>) ?? mockApi.auth.login(input);
    },
    async register(input: Parameters<typeof mockApi.auth.register>[0]): Promise<Awaited<ReturnType<typeof mockApi.auth.register>>> {
      const real = await request("/auth/register", {
        method: "POST",
        body: JSON.stringify(input),
      });
      return (real as Awaited<ReturnType<typeof mockApi.auth.register>>) ?? mockApi.auth.register(input);
    },
    async me(token: string) {
      const real = await request("/auth/me");
      if (real) return real as Awaited<ReturnType<typeof mockApi.auth.me>>;
      return mockApi.auth.me(token);
    },
    logout: () => mockApi.auth.logout(),
  },

  products: {
    async list(params?: Parameters<typeof mockApi.products.list>[0]) {
      const qs = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
      const real = await request(`/products${qs}`);
      return (real as Awaited<ReturnType<typeof mockApi.products.list>>) ?? mockApi.products.list(params);
    },
    async get(id: string) {
      const real = await request(`/products/${id}`);
      return (real as Awaited<ReturnType<typeof mockApi.products.get>>) ?? mockApi.products.get(id);
    },
    async create(input: Parameters<typeof mockApi.products.create>[0]) {
      const real = await request("/products", { method: "POST", body: JSON.stringify(input) });
      return (real as Awaited<ReturnType<typeof mockApi.products.create>>) ?? mockApi.products.create(input);
    },
    async update(id: string, patch: Parameters<typeof mockApi.products.update>[1]) {
      const real = await request(`/products/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      return (real as Awaited<ReturnType<typeof mockApi.products.update>>) ?? mockApi.products.update(id, patch);
    },
    async remove(id: string) {
      const real = await request(`/products/${id}`, { method: "DELETE" });
      if (real !== null) return;
      return mockApi.products.remove(id);
    },
  },

  orders: {
    async list(userId?: string) {
      const real = await request(`/orders${userId ? `?userId=${userId}` : ""}`);
      return (real as Awaited<ReturnType<typeof mockApi.orders.list>>) ?? mockApi.orders.list(userId);
    },
    async place(input: Parameters<typeof mockApi.orders.place>[0]) {
      const real = await request("/orders", { method: "POST", body: JSON.stringify(input) });
      return (real as Awaited<ReturnType<typeof mockApi.orders.place>>) ?? mockApi.orders.place(input);
    },
    async updateStatus(id: string, status: Parameters<typeof mockApi.orders.updateStatus>[1]) {
      const real = await request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      return (real as Awaited<ReturnType<typeof mockApi.orders.updateStatus>>) ?? mockApi.orders.updateStatus(id, status);
    },
  },

  finance: {
    async summary(userId: string) {
      const real = await request(`/analytics/me?userId=${userId}`);
      return (real as Awaited<ReturnType<typeof mockApi.finance.summary>>) ?? mockApi.finance.summary(userId);
    },
    transactions: async (userId: string): Promise<Awaited<ReturnType<typeof mockApi.finance.transactions>>> =>
      (await request(`/transactions?userId=${userId}`) as Awaited<ReturnType<typeof mockApi.finance.transactions>>) ??
      mockApi.finance.transactions(userId),
    addTransaction: async (input: Parameters<typeof mockApi.finance.addTransaction>[0]): Promise<Awaited<ReturnType<typeof mockApi.finance.addTransaction>>> =>
      (await request("/transactions", { method: "POST", body: JSON.stringify(input) }) as Awaited<ReturnType<typeof mockApi.finance.addTransaction>>) ??
      mockApi.finance.addTransaction(input),
    loans: async (userId: string): Promise<Awaited<ReturnType<typeof mockApi.finance.loans>>> =>
      (await request(`/loans?userId=${userId}`) as Awaited<ReturnType<typeof mockApi.finance.loans>>) ??
      mockApi.finance.loans(userId),
    savings: async (userId: string): Promise<Awaited<ReturnType<typeof mockApi.finance.savings>>> =>
      (await request(`/savings?userId=${userId}`) as Awaited<ReturnType<typeof mockApi.finance.savings>>) ??
      mockApi.finance.savings(userId),
    repayments: async (userId: string): Promise<Awaited<ReturnType<typeof mockApi.finance.repayments>>> =>
      (await request(`/repayments?userId=${userId}`) as Awaited<ReturnType<typeof mockApi.finance.repayments>>) ??
      mockApi.finance.repayments(userId),
  },

  users: {
    async list(params?: Parameters<typeof mockApi.users.list>[0]) {
      const qs = params ? `?${new URLSearchParams(params as Record<string, string>)}` : "";
      const real = await request(`/users${qs}`);
      return (real as Awaited<ReturnType<typeof mockApi.users.list>>) ?? mockApi.users.list(params);
    },
    async get(id: string) {
      const real = await request(`/users/${id}`);
      return (real as Awaited<ReturnType<typeof mockApi.users.get>>) ?? mockApi.users.get(id);
    },
    async update(id: string, patch: Parameters<typeof mockApi.users.update>[1]) {
      const real = await request(`/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      return (real as Awaited<ReturnType<typeof mockApi.users.update>>) ?? mockApi.users.update(id, patch);
    },
    skills: async (): Promise<Awaited<ReturnType<typeof mockApi.users.skills>>> =>
      (await request("/users/skills") as Awaited<ReturnType<typeof mockApi.users.skills>>) ??
      mockApi.users.skills(),
    addSkill: async (skill: Parameters<typeof mockApi.users.addSkill>[0]): Promise<Awaited<ReturnType<typeof mockApi.users.addSkill>>> =>
      (await request("/users/skills", { method: "POST", body: JSON.stringify(skill) }) as Awaited<ReturnType<typeof mockApi.users.addSkill>>) ??
      mockApi.users.addSkill(skill),
  },

  cooperatives: {
    async list() {
      const real = await request("/cooperatives");
      return (real as Awaited<ReturnType<typeof mockApi.cooperatives.list>>) ?? mockApi.cooperatives.list();
    },
    async get(id: string) {
      const real = await request(`/cooperatives/${id}`);
      return (real as Awaited<ReturnType<typeof mockApi.cooperatives.get>>) ?? mockApi.cooperatives.get(id);
    },
  },

  community: {
    async posts(search?: string) {
      const real = await request(`/community/posts${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      return (real as Awaited<ReturnType<typeof mockApi.community.posts>>) ?? mockApi.community.posts(search);
    },
    async createPost(input: Parameters<typeof mockApi.community.createPost>[0]) {
      const real = await request("/community/posts", { method: "POST", body: JSON.stringify(input) });
      return (real as Awaited<ReturnType<typeof mockApi.community.createPost>>) ?? mockApi.community.createPost(input);
    },
    async like(postId: string) {
      const real = await request(`/community/posts/${postId}/like`, { method: "POST" });
      return (real as Awaited<ReturnType<typeof mockApi.community.like>>) ?? mockApi.community.like(postId);
    },
    async comment(postId: string, input: Parameters<typeof mockApi.community.comment>[1]) {
      const real = await request(`/community/posts/${postId}/comments`, { method: "POST", body: JSON.stringify(input) });
      return (real as Awaited<ReturnType<typeof mockApi.community.comment>>) ?? mockApi.community.comment(postId, input);
    },
  },

  matches: {
    async list() {
      const real = await request("/matches");
      return (real as Awaited<ReturnType<typeof mockApi.matches.list>>) ?? mockApi.matches.list();
    },
  },

  notifications: {
    async list(userId: string) {
      const real = await request(`/notifications?userId=${userId}`);
      return (real as Awaited<ReturnType<typeof mockApi.notifications.list>>) ?? mockApi.notifications.list(userId);
    },
    async markRead(id: string) {
      const real = await request(`/notifications/${id}/read`, { method: "PATCH" });
      if (real !== null) return;
      return mockApi.notifications.markRead(id);
    },
  },

  analytics: {
    async summary() {
      const real = await request("/analytics");
      return (real as Awaited<ReturnType<typeof mockApi.analytics.summary>>) ?? mockApi.analytics.summary();
    },
  },
};

export { resetMockDB, getSession };
export const DEMO_LOGIN = {
  email: "lakshmi@demo.herway",
  password: "HerWay@123",
};