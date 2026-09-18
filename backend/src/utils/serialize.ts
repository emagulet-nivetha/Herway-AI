import type {
  Availability,
  Comment,
  Cooperative,
  Order,
  OrderItem,
  Post,
  Product,
  User,
  UserSkill,
} from "@prisma/client";

type UserWithRelations = User & {
  cooperative?: Cooperative | null;
  skills?: (UserSkill & { skill: { name: string; category: string } })[];
};

type ProductWithSeller = Product & { seller?: Pick<User, "id" | "name"> };

type OrderWithItems = Order & { items?: OrderItem[] };

type PostWithAuthor = Post & {
  author?: Pick<User, "id" | "name" | "avatarUrl">;
  comments?: (Comment & { author?: Pick<User, "id" | "name" | "avatarUrl"> })[];
};

const AVAILABILITY_LABELS: Record<Availability, string> = {
  In_Stock: "In Stock",
  Made_to_Order: "Made to Order",
  Limited: "Limited",
};

export function serializeUser(u: UserWithRelations) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone ?? undefined,
    role: u.role,
    avatarUrl: u.avatarUrl,
    location: u.location,
    state: u.state ?? undefined,
    bio: u.bio ?? undefined,
    languages: u.languages,
    cooperativeId: u.cooperativeId,
    cooperative: u.cooperative?.name,
    experienceYears: u.experienceYears ?? undefined,
    verified: u.verified,
    joinedAt: u.createdAt.toISOString(),
    achievements: u.achievements,
    collaborationInterests: u.collaborationInterests,
    skills: (u.skills || []).map((s) => ({
      id: s.id,
      skillId: s.skillId,
      skillName: s.skill.name,
      category: s.skill.category,
      level: s.level,
      years: s.years,
    })),
  };
}

export function serializeProduct(p: ProductWithSeller) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    imageUrl: p.imageUrl,
    sellerId: p.sellerId,
    sellerName: p.seller?.name ?? "HerWay seller",
    cooperativeId: p.cooperativeId ?? undefined,
    location: p.location,
    rating: p.rating,
    ratingCount: p.ratingCount,
    availability: AVAILABILITY_LABELS[p.availability],
    stock: p.stock,
    status: p.status,
    featured: p.featured,
    materials: p.materials,
    tags: p.tags,
    createdAt: p.createdAt.toISOString(),
  };
}

export function serializeOrder(o: OrderWithItems) {
  return {
    id: o.id,
    userId: o.userId,
    customerName: o.customerName,
    items: (o.items || []).map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      price: i.price,
      quantity: i.quantity,
      imageUrl: i.imageUrl,
    })),
    total: o.total,
    status: o.status,
    placedAt: o.placedAt.toISOString(),
    delivery: o.delivery ?? undefined,
  };
}

export function serializePost(p: PostWithAuthor, likedByMe = false) {
  return {
    id: p.id,
    authorId: p.authorId,
    authorName: p.author?.name ?? "Member",
    authorAvatar: p.author?.avatarUrl ?? "",
    content: p.content,
    tags: p.tags,
    likes: p.likes,
    likedByMe,
    createdAt: p.createdAt.toISOString(),
    type: p.type,
    comments: (p.comments || []).map((c) => ({
      id: c.id,
      authorId: c.authorId,
      authorName: c.author?.name ?? "Member",
      authorAvatar: c.author?.avatarUrl ?? "",
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

export function serializeCooperative(c: Cooperative) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    location: c.location,
    description: c.description,
    logoUrl: c.logoUrl ?? undefined,
    members: c.members,
    activeMembers: c.activeMembers,
    adminId: c.adminId,
    createdAt: c.createdAt.toISOString(),
  };
}
