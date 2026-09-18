// ─────────────────────────────────────────────────────────────
// HerWay AI — Shared TypeScript types
// ─────────────────────────────────────────────────────────────

export type UserRole = "member" | "cooperative_admin" | "platform_admin";

export type Language = "en" | "ta" | "hi";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRole;
  avatarUrl: string;
  location: string;
  state?: string;
  bio?: string;
  languages: Language[];
  cooperativeId?: string | null;
  cooperative?: string;
  experienceYears?: number;
  verified: boolean;
  joinedAt: string;
  skills?: Skill[];
  achievements?: string[];
  collaborationInterests?: string[];
}

export interface Cooperative {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  logoUrl?: string;
  members: number;
  activeMembers: number;
  adminId: string;
  createdAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface UserSkill {
  id: string;
  skillId: string;
  skillName: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
}

export type ProductStatus = "active" | "pending" | "inactive";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  cooperative?: string;
  location: string;
  rating: number;
  ratingCount: number;
  availability: "In Stock" | "Made to Order" | "Limited";
  stock: number;
  status: ProductStatus;
  featured?: boolean;
  materials?: string[];
  tags?: string[];
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  delivery?: string;
}

export type TransactionType = "savings" | "loan" | "repayment" | "contribution" | "sale";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  authorizedBy?: string;
}

export interface SavingsRecord {
  id: string;
  userId: string;
  date: string;
  amount: number;
  channel?: string;
  note?: string;
}

export interface Loan {
  id: string;
  userId: string;
  principal: number;
  balance: number;
  interestRate: number;
  issuedAt: string;
  purpose?: string;
  status: "active" | "closed";
}

export interface Repayment {
  id: string;
  loanId: string;
  userId: string;
  amount: number;
  date: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  tags: string[];
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
  createdAt: string;
  type: "post" | "achievement" | "question" | "opportunity" | "workshop";
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface MatchSuggestion {
  id: string;
  userName: string;
  avatarUrl: string;
  location: string;
  skills: string[];
  interest: string;
  matchScore: number;
  opportunity: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "order" | "message" | "match" | "finance" | "system";
}

export interface PlaceOrderInput {
  userId: string;
  items: { productId: string; quantity: number }[];
  delivery?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
  phone?: string;
  languages?: Language[];
  cooperativeId?: string;
}

export interface FinancialSummary {
  totalSavings: number;
  loanBalance: number;
  totalRepaid: number;
  monthlyContribution: number;
  totalSales: number;
  savingsTrend: { month: string; amount: number }[];
  repaymentProgress: { label: string; value: number }[];
  transactions: Transaction[];
}

export interface AnalyticsSummary {
  business: {
    totalSales: number;
    totalOrders: number;
    productPerformance: { name: string; sales: number; revenue: number }[];
  };
  community: {
    totalMembers: number;
    skillDistribution: { skill: string; count: number }[];
    collaborations: number;
  };
  financial: {
    totalSavings: number;
    totalLoans: number;
    savingsTrend: { month: string; amount: number }[];
    loanRecoveryRate: number;
  };
}