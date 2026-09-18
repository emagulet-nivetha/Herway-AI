import {
  DEMO_PRODUCTS,
  DEMO_USERS,
  DEMO_COOPERATIVES,
  DEMO_ORDERS,
  DEMO_TRANSACTIONS,
  DEMO_SAVINGS,
  DEMO_LOANS,
  DEMO_REPAYMENTS,
  DEMO_POSTS,
  DEMO_MATCHES,
  DEMO_NOTIFICATIONS,
  DEMO_ANALYTICS,
} from "@/data/demo-data";
import type {
  Product,
  User,
  Order,
  Transaction,
  Post,
  Notification,
  Cooperative,
  Loan,
  Repayment,
  SavingsRecord,
  RegisterInput,
  LoginInput,
  AuthResponse,
  FinancialSummary,
  AnalyticsSummary,
  PlaceOrderInput,
  UserSkill,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Mock API service — a fully-working in-browser data layer with
// localStorage persistence. Mirrors the shape of the real REST
// API so swapping to the backend requires no component changes.
// ─────────────────────────────────────────────────────────────

const LS_KEY = "herway.mock.db.v1";
const SESSION_KEY = "herway.session.v1";

interface MockDB {
  users: (User & { password?: string })[];
  products: Product[];
  cooperatives: Cooperative[];
  orders: Order[];
  transactions: Transaction[];
  savings: SavingsRecord[];
  loans: Loan[];
  repayments: Repayment[];
  posts: Post[];
  notifications: Notification[];
  skills: UserSkill[];
}

const DEMO_PASSWORDS: Record<string, string> = {
  "lakshmi@demo.herway": "HerWay@123",
  "saroja@demo.herway": "HerWay@123",
  "maya@demo.herway": "HerWay@123",
  "priya@demo.herway": "HerWay@123",
};

function loadDB(): MockDB {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return seedDB();
}

function seedDB(): MockDB {
  const db: MockDB = {
    users: DEMO_USERS.map((u) => ({
      ...u,
      password: DEMO_PASSWORDS[u.email] ?? "HerWay@123",
    })),
    products: [...DEMO_PRODUCTS],
    cooperatives: [...DEMO_COOPERATIVES],
    orders: [...DEMO_ORDERS],
    transactions: [...DEMO_TRANSACTIONS],
    savings: [...DEMO_SAVINGS],
    loans: [...DEMO_LOANS],
    repayments: [...DEMO_REPAYMENTS],
    posts: [...DEMO_POSTS],
    notifications: [...DEMO_NOTIFICATIONS],
    skills: [
      { id: "us-x1", skillId: "sk-1", skillName: "Tailoring", category: "Clothing", level: "Expert", years: 8 },
      { id: "us-x2", skillId: "sk-2", skillName: "Embroidery", category: "Handicrafts", level: "Advanced", years: 6 },
    ],
  };
  saveDB(db);
  return db;
}

function saveDB(db: MockDB) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(db));
  } catch {
    /* ignore quota errors */
  }
}

let db = loadDB();

function delay<T>(value: T, ms = 260): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function publicUser(u: User & { password?: string }): User {
  const { password, ...rest } = u;
  return rest as User;
}

function tokenFor(user: User) {
  // Simulated signed token — the real backend issues a proper JWT.
  return `mock.${btoa(unescape(encodeURIComponent(JSON.stringify({ sub: user.id, role: user.role }))))}.sig`;
}

// ── Auth ────────────────────────────────────────────────────
export const mockApi = {
  auth: {
    async login(input: LoginInput): Promise<AuthResponse> {
      const user = db.users.find(
        (u) => u.email.toLowerCase() === input.email.toLowerCase()
      );
      if (!user || user.password !== input.password) {
        throw new Error("Invalid email or password. Try the demo account below.");
      }
      const pu = publicUser(user);
      saveSession(pu, tokenFor(pu));
      return delay({ token: tokenFor(pu), user: pu }, 420);
    },

    async register(input: RegisterInput): Promise<AuthResponse> {
      if (db.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error("An account with this email already exists.");
      }
      const coop = input.cooperativeId
        ? db.cooperatives.find((c) => c.id === input.cooperativeId)
        : undefined;
      const newUser: User & { password?: string } = {
        id: uid("u"),
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          input.name
        )}&backgroundColor=7047A8`,
        location: input.location || "India",
        phone: input.phone,
        languages: input.languages || ["en"],
        cooperativeId: input.cooperativeId ?? null,
        cooperative: coop?.name,
        verified: false,
        joinedAt: new Date().toISOString(),
        achievements: [],
        collaborationInterests: [],
      };
      db.users.push(newUser);
      saveDB(db);
      const pu = publicUser(newUser);
      saveSession(pu, tokenFor(pu));
      return delay({ token: tokenFor(pu), user: pu }, 520);
    },

    async me(token: string): Promise<User | null> {
      const session = getSession();
      if (!session) return null;
      const u = db.users.find((x) => x.id === session.user.id);
      return delay(u ? publicUser(u) : null, 120);
    },

    logout() {
      localStorage.removeItem(SESSION_KEY);
    },
  },

  // ── Products ──────────────────────────────────────────────
  products: {
    async list(params?: {
      category?: string;
      search?: string;
      location?: string;
      sort?: string;
      sellerId?: string;
    }): Promise<Product[]> {
      let items = [...db.products];
      if (params?.category && params.category !== "all") {
        items = items.filter((p) => p.category === params.category);
      }
      if (params?.location && params.location !== "all") {
        items = items.filter((p) => p.location.includes(params.location!));
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.sellerName.toLowerCase().includes(q) ||
            p.tags?.some((t) => t.toLowerCase().includes(q))
        );
      }
      if (params?.sort === "price-asc") items.sort((a, b) => a.price - b.price);
      else if (params?.sort === "price-desc") items.sort((a, b) => b.price - a.price);
      else if (params?.sort === "rating") items.sort((a, b) => b.rating - a.rating);
      else items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      return delay(items);
    },

    async get(id: string): Promise<Product> {
      const p = db.products.find((x) => x.id === id);
      if (!p) throw new Error("Product not found");
      return delay(p, 180);
    },

    async create(input: Partial<Product>): Promise<Product> {
      const product: Product = {
        id: uid("p"),
        name: input.name || "Untitled product",
        description: input.description || "",
        price: Number(input.price) || 0,
        category: input.category || "Handicrafts",
        imageUrl:
          input.imageUrl ||
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&q=80",
        sellerId: input.sellerId || "u-1",
        sellerName: input.sellerName || "You",
        cooperative: input.cooperative,
        location: input.location || "India",
        rating: 0,
        ratingCount: 0,
        availability: input.availability || "In Stock",
        stock: Number(input.stock) || 1,
        status: "active",
        materials: input.materials,
        tags: input.tags,
        createdAt: new Date().toISOString(),
      };
      db.products.unshift(product);
      saveDB(db);
      return delay(product, 380);
    },

    async update(id: string, patch: Partial<Product>): Promise<Product> {
      const idx = db.products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found");
      db.products[idx] = { ...db.products[idx], ...patch };
      saveDB(db);
      return delay(db.products[idx]);
    },

    async remove(id: string): Promise<void> {
      db.products = db.products.filter((p) => p.id !== id);
      saveDB(db);
      return delay(undefined, 200);
    },
  },

  // ── Orders ────────────────────────────────────────────────
  orders: {
    async list(userId?: string): Promise<Order[]> {
      const items = userId ? db.orders.filter((o) => o.userId === userId) : [...db.orders];
      return delay(items);
    },
    async place(input: PlaceOrderInput): Promise<Order> {
      const items = input.items
        .map((i) => {
          const p = db.products.find((x) => x.id === i.productId);
          if (!p) return null;
          return {
            id: uid("oi"),
            productId: p.id,
            productName: p.name,
            price: p.price,
            quantity: i.quantity,
            imageUrl: p.imageUrl,
          };
        })
        .filter(Boolean) as Order["items"];
      const user = db.users.find((u) => u.id === input.userId);
      const order: Order = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        userId: input.userId,
        customerName: user?.name || "Customer",
        items,
        total: items.reduce((s, i) => s + i.price * i.quantity, 0),
        status: "pending",
        placedAt: new Date().toISOString(),
        delivery: input.delivery,
      };
      db.orders.unshift(order);
      saveDB(db);
      return delay(order, 500);
    },
    async updateStatus(id: string, status: Order["status"]): Promise<Order> {
      const idx = db.orders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error("Order not found");
      db.orders[idx] = { ...db.orders[idx], status };
      saveDB(db);
      return delay(db.orders[idx]);
    },
  },

  // ── Financials ────────────────────────────────────────────
  finance: {
    async summary(userId: string): Promise<FinancialSummary> {
      const userTx = db.transactions.filter((t) => t.userId === userId);
      const userSavings = db.savings.filter((s) => s.userId === userId);
      const userLoan = db.loans.find((l) => l.userId === userId && l.status === "active");
      const userRepayments = db.repayments.filter((r) => r.userId === userId);
      const sales = userTx.filter((t) => t.type === "sale").reduce((s, t) => s + t.amount, 0);

      const byMonthMap = new Map<string, number>();
      userSavings.forEach((s) => {
        const m = new Date(s.date).toLocaleString("en", { month: "short" });
        byMonthMap.set(m, (byMonthMap.get(m) || 0) + s.amount);
      });
      let running = 0;
      const savingsTrend = Array.from(byMonthMap.entries()).map(([month, amount]) => {
        running += amount;
        return { month, amount: running };
      });

      return delay({
        totalSavings: userSavings.reduce((s, x) => s + x.amount, 0),
        loanBalance: userLoan?.balance ?? 0,
        totalRepaid: userRepayments.reduce((s, r) => s + r.amount, 0),
        monthlyContribution: 2000,
        totalSales: sales,
        savingsTrend,
        repaymentProgress: userLoan
          ? [
              { label: "Repaid", value: userRepayments.reduce((s, r) => s + r.amount, 0) },
              { label: "Remaining", value: userLoan.balance },
            ]
          : [
              { label: "Repaid", value: 1 },
              { label: "Remaining", value: 0 },
            ],
        transactions: userTx.sort(
          (a, b) => +new Date(b.date) - +new Date(a.date)
        ),
      });
    },
    async transactions(userId: string): Promise<Transaction[]> {
      return delay(
        db.transactions
          .filter((t) => t.userId === userId)
          .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      );
    },
    async addTransaction(input: Omit<Transaction, "id">): Promise<Transaction> {
      const tx: Transaction = { ...input, id: uid("t") };
      db.transactions.unshift(tx);
      saveDB(db);
      return delay(tx, 320);
    },
    async loans(userId: string): Promise<Loan[]> {
      return delay(db.loans.filter((l) => l.userId === userId));
    },
    async savings(userId: string): Promise<SavingsRecord[]> {
      return delay(db.savings.filter((s) => s.userId === userId));
    },
    async repayments(userId: string): Promise<Repayment[]> {
      return delay(db.repayments.filter((r) => r.userId === userId));
    },
  },

  // ── Users & skills ────────────────────────────────────────
  users: {
    async list(params?: { role?: string; cooperativeId?: string }): Promise<User[]> {
      let items = db.users.map(publicUser);
      if (params?.role) items = items.filter((u) => u.role === params.role);
      if (params?.cooperativeId)
        items = items.filter((u) => u.cooperativeId === params.cooperativeId);
      return delay(items);
    },
    async get(id: string): Promise<User> {
      const u = db.users.find((x) => x.id === id);
      if (!u) throw new Error("User not found");
      return delay(publicUser(u));
    },
    async update(id: string, patch: Partial<User>): Promise<User> {
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx === -1) throw new Error("User not found");
      db.users[idx] = { ...db.users[idx], ...patch };
      saveDB(db);
      const pu = publicUser(db.users[idx]);
      const session = getSession();
      if (session?.user.id === id) saveSession(pu, session.token);
      return delay(pu);
    },
    async skills(): Promise<UserSkill[]> {
      return delay([...db.skills]);
    },
    async addSkill(skill: UserSkill): Promise<UserSkill> {
      const s = { ...skill, id: uid("us") };
      db.skills.push(s);
      saveDB(db);
      return delay(s);
    },
  },

  // ── Cooperatives ──────────────────────────────────────────
  cooperatives: {
    async list(): Promise<Cooperative[]> {
      return delay([...db.cooperatives]);
    },
    async get(id: string): Promise<Cooperative> {
      const c = db.cooperatives.find((x) => x.id === id);
      if (!c) throw new Error("Cooperative not found");
      return delay(c);
    },
  },

  // ── Community ─────────────────────────────────────────────
  community: {
    async posts(search?: string): Promise<Post[]> {
      let items = [...db.posts].sort(
        (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
      );
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(
          (p) =>
            p.content.toLowerCase().includes(q) ||
            p.tags.some((t) => t.includes(q)) ||
            p.authorName.toLowerCase().includes(q)
        );
      }
      return delay(items);
    },
    async createPost(input: {
      authorId: string;
      authorName: string;
      authorAvatar: string;
      content: string;
      tags: string[];
    }): Promise<Post> {
      const post: Post = {
        id: uid("post"),
        ...input,
        likes: 0,
        likedByMe: false,
        comments: [],
        createdAt: new Date().toISOString(),
        type: "post",
      };
      db.posts.unshift(post);
      saveDB(db);
      return delay(post, 360);
    },
    async like(postId: string): Promise<Post> {
      const p = db.posts.find((x) => x.id === postId);
      if (!p) throw new Error("Post not found");
      p.likedByMe = !p.likedByMe;
      p.likes += p.likedByMe ? 1 : -1;
      saveDB(db);
      return delay(p, 120);
    },
    async comment(
      postId: string,
      input: { authorId: string; authorName: string; authorAvatar: string; content: string }
    ): Promise<Post> {
      const p = db.posts.find((x) => x.id === postId);
      if (!p) throw new Error("Post not found");
      p.comments.push({ id: uid("cm"), createdAt: new Date().toISOString(), ...input });
      saveDB(db);
      return delay(p, 220);
    },
  },

  // ── Matches ───────────────────────────────────────────────
  matches: {
    async list(): Promise<typeof DEMO_MATCHES> {
      return delay([...DEMO_MATCHES]);
    },
  },

  // ── Notifications ─────────────────────────────────────────
  notifications: {
    async list(userId: string): Promise<Notification[]> {
      return delay(db.notifications.filter((n) => n.userId === userId));
    },
    async markRead(id: string): Promise<void> {
      const n = db.notifications.find((x) => x.id === id);
      if (n) n.read = true;
      saveDB(db);
      return delay(undefined, 100);
    },
  },

  // ── Analytics ─────────────────────────────────────────────
  analytics: {
    async summary(): Promise<AnalyticsSummary> {
      return delay(DEMO_ANALYTICS);
    },
  },
};

// ── Session helpers ─────────────────────────────────────────
export function saveSession(user: User, token: string) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }));
}

export function getSession(): { user: User; token: string } | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function resetMockDB() {
  db = seedDB();
}
