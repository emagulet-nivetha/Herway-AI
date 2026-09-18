# HerWay AI

An AI-powered digital platform for **women-led Self-Help Groups (SHGs), artisan groups, micro-cooperatives, and women entrepreneurs**. HerWay AI brings together a marketplace, a skills & collaboration network, simple financial record-keeping, and an AI assistant — in one responsive, mobile-first app.

> **What this is, and is not.** HerWay AI is a **marketplace, coordination, and record-keeping** tool. It is **not** a lending platform, a bank replacement, or an income-guarantee scheme. The financial profile is an **activity record — not a guaranteed credit score or lending decision**. Skill matches are **experimental suggestions**. All example statistics and stories are demo data.

---

## Highlights

- **Marketplace** — browse, search, filter, wishlist, cart, and checkout for products and local services.
- **Skill Connect** — member skill profiles with an experimental, explainable match score and collaboration suggestions.
- **Cooperative Network** — discover women-led cooperatives and their products.
- **Community Feed** — posts, tips, opportunities, workshops, comments, and likes.
- **Financial Records** — savings, loans, repayments, and transaction history with CSV export.
- **AI Assistant** — provider-agnostic chat helper for pricing, product descriptions, and business guidance.
- **Dashboards** — separate member and cooperative experiences with lightweight, inspectable analytics.
- **Role-based access** — `member`, `cooperative_admin`, `platform_admin`.

---

## Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, TypeScript 5, Vite 5, Tailwind CSS 3, React Router 6, Recharts, lucide-react |
| Backend   | Node.js, Express 4, TypeScript 5, Prisma 5 (PostgreSQL), Zod |
| Auth      | JWT + bcrypt |
| Hardening | Helmet, CORS, compression, rate limiting, request validation |
| AI        | Swappable provider layer (`mock`, `openai`, `anthropic`) |

The frontend runs **standalone against a built-in mock data layer** (localStorage) when no backend is configured — ideal for quick demos.

---

## Monorepo Layout

```
HerWay AI/
├── frontend/                 # React + Vite + Tailwind app
│   ├── src/
│   │   ├── components/       # ui/, layout/, dashboard/, marketplace/, community/, ai/
│   │   ├── pages/            # public, auth, dashboard/, cooperative/
│   │   ├── context/          # AuthContext, CartContext
│   │   ├── services/         # api.ts (real→mock), mockApi.ts, aiService.ts
│   │   ├── data/             # demo-data.ts
│   │   ├── hooks/ utils/ types/
│   │   ├── App.tsx           # router
│   │   └── main.tsx
│   └── .env.example
├── backend/                  # Express + Prisma API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/           # env.ts, prisma.ts
│   │   ├── middleware/       # auth, rbac, validate, errorHandler, rateLimiter
│   │   ├── services/         # ai.service.ts, analytics.service.ts
│   │   ├── routes/           # auth, users, products, orders, finance, ...
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   └── .env.example
├── package.json              # npm workspaces + scripts
└── README.md
```

---

## Prerequisites

- **Node.js 18+** and **npm 9+**
- **PostgreSQL 14+** — only required if you run the real backend. The frontend works without it.

---

## Quick Start (frontend only, mock data)

```bash
npm install
npm run dev:frontend
```

Open http://localhost:5173. No database or API key needed — the app uses the mock data layer.

### Demo logins

| Role               | Email                   | Password     |
|--------------------|-------------------------|--------------|
| Member             | `lakshmi@demo.herway`   | `HerWay@123` |
| Member             | `saroja@demo.herway`*   | `HerWay@123` |
| Cooperative admin  | `saroja@demo.herway`    | `HerWay@123` |
| Platform admin     | `maya@demo.herway`      | `HerWay@123` |

\* Use `saroja@demo.herway` to see the cooperative dashboard. Other demo users: `meena@demo.herway`, `priya@demo.herway`, `anitha@demo.herway`, `kavitha@demo.herway`, `deepa@demo.herway`.

---

## Full Stack Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

- `DATABASE_URL` — your PostgreSQL connection string
- `JWT_SECRET` — a long random string
- `AI_PROVIDER` — `mock` (default), `openai`, or `anthropic` (add the matching API key)

### 3. Create the database schema and seed demo data

```bash
npm run db:generate
npm run db:migrate      # creates tables (use a Prisma migration name when prompted)
npm run db:seed         # loads demo users, products, orders, finance, community
```

### 4. Configure the frontend

```bash
cp frontend/.env.example frontend/.env
```

Set `VITE_API_URL=http://localhost:5000/api` to use the real backend. Leave it empty for mock mode.

### 5. Run both apps

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000 (`GET /health`)

---

## Available Scripts

From the repository root:

| Script                 | Description |
|------------------------|-------------|
| `npm run dev`          | Run frontend + backend together |
| `npm run dev:frontend` | Run the Vite dev server only |
| `npm run dev:backend`  | Run the API only |
| `npm run build`        | Type-check + build both workspaces |
| `npm run db:generate`  | Generate the Prisma client |
| `npm run db:migrate`   | Apply database migrations |
| `npm run db:seed`      | Seed demo data |
| `npm run lint`         | Type-check frontend and backend |

---

## AI Service Layer

`backend/src/services/ai.service.ts` and `frontend/src/services/aiService.ts` expose a provider-agnostic interface. Switch providers with a single environment variable:

```
AI_PROVIDER=mock       # deterministic local responses (default, no key required)
AI_PROVIDER=openai     # requires OPENAI_API_KEY
AI_PROVIDER=anthropic  # requires ANTHROPIC_API_KEY
```

Notes on responsible AI:

- The assistant is framed as **guidance, not verified fact**. Suggestions should be reviewed by the user.
- Recommendations and match scores are **experimental** and explainable, not authoritative.
- No financial advice is generated, and no outcome is guaranteed.

---

## Design System

- **Primary:** Deep Purple `#5B3A8E`, Royal Violet `#7047A8`
- **Secondary:** Teal `#168C87`, Soft Rose `#E9A7B8`
- **Neutrals:** Warm Cream `#FFF9F4`, White, Charcoal text `#242424`
- **Type:** Poppins (headings), Inter (body)
- Mobile-first, accessible, and calm — deliberately avoiding stereotyped, overly pink branding.

---

## Data & Ethics Notes

- All included statistics, reviews, and success stories are **illustrative demo data**.
- The platform never presents financial activity as a credit score or lending decision.
- Role-based access protects member and cooperative data.
- The backend validates all write requests and applies rate limiting.

---

## License

Released for educational and demonstration purposes.
