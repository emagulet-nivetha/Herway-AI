/* eslint-disable no-console */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "HerWay@123";

const avatar = (id: string) => `https://api.dicebear.com/7.x/initials/svg?seed=${id}&backgroundColor=7047A8`;

async function main() {
  console.log("Seeding HerWay AI demo data…");

  // Clear in dependency order
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.repayment.deleteMany();
  await prisma.loan.deleteMany();
  await prisma.savingsRecord.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.matchSuggestion.deleteMany();
  await prisma.aIRecommendation.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.cooperative.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // ── Users (cooperativeId assigned after cooperatives exist) ──
  const users = [
    { id: "u-1", name: "Lakshmi Venkatesan", email: "lakshmi@demo.herway", role: "member" as const, location: "Coimbatore, Tamil Nadu", languages: ["en", "ta"], experienceYears: 8, verified: true, bio: "Tailor and master dart-fitter. I make custom-fit kurta sets and blouses." },
    { id: "u-2", name: "Meena Devi", email: "meena@demo.herway", role: "member" as const, location: "Madurai, Tamil Nadu", languages: ["en", "ta"], experienceYears: 6, verified: true, bio: "Hand embroidery artisan — chain stitch, mirror work, kantha detailing." },
    { id: "u-3", name: "Saroja Krishnan", email: "saroja@demo.herway", role: "cooperative_admin" as const, location: "Coimbatore, Tamil Nadu", languages: ["en", "ta"], experienceYears: 12, verified: true, bio: "Cooperative convenor. Led our group from paper records to a digital storefront." },
    { id: "u-4", name: "Priya Sharma", email: "priya@demo.herway", role: "member" as const, location: "Jaipur, Rajasthan", languages: ["en", "hi"], experienceYears: 4, verified: true, bio: "Baking and food processing — small-batch cookies and festive boxes." },
    { id: "u-5", name: "Anitha Raja", email: "anitha@demo.herway", role: "member" as const, location: "Chennai, Tamil Nadu", languages: ["en", "ta"], experienceYears: 3, verified: false, bio: "Basket and cane weaving from palm leaf and water hyacinth." },
    { id: "u-6", name: "Kavitha Murugan", email: "kavitha@demo.herway", role: "member" as const, location: "Trichy, Tamil Nadu", languages: ["en", "ta"], experienceYears: 5, verified: true, bio: "Digital marketer and content writer helping artisan groups sell online." },
    { id: "u-7", name: "Maya Iyer", email: "maya@demo.herway", role: "platform_admin" as const, location: "Bengaluru, Karnataka", languages: ["en", "hi", "ta"], experienceYears: 10, verified: true, bio: "HerWay platform operations lead." },
    { id: "u-8", name: "Deepa Menon", email: "deepa@demo.herway", role: "member" as const, location: "Wayanad, Kerala", languages: ["en"], experienceYears: 7, verified: true, bio: "Organic vegetable and spice farmer." },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        location: u.location,
        languages: u.languages,
        experienceYears: u.experienceYears,
        verified: u.verified,
        bio: u.bio,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=7047A8`,
      },
    });
  }
  console.log(`  ✓ ${users.length} users`);

  // ── Cooperatives ──
  await prisma.cooperative.createMany({
    data: [
      { id: "c-1", name: "Women Artisan Cooperative", type: "Artisan Cooperative", location: "Coimbatore, Tamil Nadu", description: "A women-led cooperative of 48 artisans making handcrafted textiles, baskets, candles, and food products.", adminId: "u-3", members: 48, activeMembers: 41 },
      { id: "c-2", name: "Green Thumb Collective", type: "Agriculture Collective", location: "Wayanad, Kerala", description: "Organic farmers collective growing spices, vegetables, and millets through sustainable methods.", adminId: "u-8", members: 32, activeMembers: 27 },
    ],
  });
  await prisma.user.updateMany({ where: { id: { in: ["u-1", "u-2", "u-3", "u-5", "u-6"] } }, data: { cooperativeId: "c-1" } });
  await prisma.user.update({ where: { id: "u-8" }, data: { cooperativeId: "c-2" } });
  console.log("  ✓ 2 cooperatives");

  // ── Skills ──
  const skills = [
    { id: "sk-1", name: "Tailoring", category: "Clothing" },
    { id: "sk-2", name: "Embroidery", category: "Handicrafts" },
    { id: "sk-3", name: "Basket Weaving", category: "Handicrafts" },
    { id: "sk-4", name: "Food Processing", category: "Food" },
    { id: "sk-5", name: "Digital Marketing", category: "Digital" },
    { id: "sk-6", name: "Agriculture", category: "Agriculture" },
    { id: "sk-7", name: "Candle Making", category: "Handicrafts" },
    { id: "sk-8", name: "Content Writing", category: "Digital" },
  ];
  await prisma.skill.createMany({ data: skills });

  const userSkills = [
    { userId: "u-1", skillId: "sk-1", level: "Expert", years: 8 },
    { userId: "u-2", skillId: "sk-2", level: "Advanced", years: 6 },
    { userId: "u-5", skillId: "sk-3", level: "Expert", years: 5 },
    { userId: "u-4", skillId: "sk-4", level: "Advanced", years: 4 },
    { userId: "u-6", skillId: "sk-5", level: "Advanced", years: 5 },
    { userId: "u-8", skillId: "sk-6", level: "Expert", years: 7 },
    { userId: "u-5", skillId: "sk-7", level: "Intermediate", years: 2 },
    { userId: "u-6", skillId: "sk-8", level: "Advanced", years: 5 },
  ];
  for (const s of userSkills) await prisma.userSkill.create({ data: s });
  console.log(`  ✓ ${skills.length} skills, ${userSkills.length} member-skill links`);

  // ── Products ──
  const products = [
    { id: "p-1", name: "Handwoven Silk Saree", price: 3899, category: "Clothing", sellerId: "u-1", cooperativeId: "c-1", location: "Coimbatore, Tamil Nadu", rating: 4.9, ratingCount: 128, availability: "Made_to_Order" as const, stock: 6, featured: true, imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80", materials: ["Mulberry silk", "Zari"], tags: ["saree", "silk", "handwoven"], description: "A lustrous handwoven silk saree with contrast zari border, woven by master weavers." },
    { id: "p-2", name: "Mirror Work Embroidered Bag", price: 649, category: "Handicrafts", sellerId: "u-2", cooperativeId: "c-1", location: "Madurai, Tamil Nadu", rating: 4.8, ratingCount: 86, availability: "In_Stock" as const, stock: 24, featured: true, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", materials: ["Cotton canvas", "Thread", "Mirror discs"], tags: ["bag", "embroidery", "mirror work"], description: "Hand-embroidered cotton tote bag with traditional mirror work detailing." },
    { id: "p-3", name: "Organic Turmeric Powder", price: 180, category: "Food Products", sellerId: "u-8", cooperativeId: "c-2", location: "Wayanad, Kerala", rating: 4.7, ratingCount: 210, availability: "In_Stock" as const, stock: 60, featured: true, imageUrl: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80", materials: ["Organic turmeric"], tags: ["organic", "spices", "farm"], description: "Sun-dried and stone-ground organic turmeric. No additives. 250g pack." },
    { id: "p-4", name: "Handmade Aromatic Candle Set", price: 450, category: "Home Products", sellerId: "u-5", cooperativeId: "c-1", location: "Chennai, Tamil Nadu", rating: 4.6, ratingCount: 54, availability: "In_Stock" as const, stock: 30, imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80", materials: ["Soy wax", "Essential oils", "Terracotta"], tags: ["candle", "home"], description: "Set of 3 soy-wax candles in jasmine, sandalwood, and lemongrass." },
    { id: "p-5", name: "Water Hyacinth Basket", price: 520, category: "Handicrafts", sellerId: "u-5", cooperativeId: "c-1", location: "Chennai, Tamil Nadu", rating: 4.7, ratingCount: 39, availability: "Made_to_Order" as const, stock: 8, imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80", materials: ["Water hyacinth", "Jute"], tags: ["basket", "eco"], description: "Eco-friendly woven basket from dried water hyacinth stems." },
    { id: "p-6", name: "Small Batch Millet Cookies", price: 240, category: "Food Products", sellerId: "u-4", location: "Jaipur, Rajasthan", rating: 4.8, ratingCount: 95, availability: "In_Stock" as const, stock: 40, imageUrl: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80", materials: ["Ragi", "Oats", "Jaggery"], tags: ["cookies", "millet"], description: "Crunchy ragi and oat cookies sweetened with jaggery. Baked weekly." },
    { id: "p-7", name: "Custom Fit Kurta Set", price: 999, category: "Clothing", sellerId: "u-1", cooperativeId: "c-1", location: "Coimbatore, Tamil Nadu", rating: 4.9, ratingCount: 74, availability: "Made_to_Order" as const, stock: 12, featured: true, imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80", materials: ["Cotton", "Linen"], tags: ["kurta", "tailoring"], description: "Tailored to your measurements — cotton or linen kurta with churidar and dupatta." },
    { id: "p-8", name: "Handcrafted Soap Gift Box", price: 380, category: "Beauty", sellerId: "u-4", location: "Jaipur, Rajasthan", rating: 4.5, ratingCount: 61, availability: "In_Stock" as const, stock: 25, imageUrl: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&q=80", materials: ["Coconut oil", "Neem", "Honey"], tags: ["soap", "beauty"], description: "Cold-process soap bars in neem-tulsi, oat-honey, and coffee-carrot." },
    { id: "p-9", name: "Organic Honey — Raw & Unfiltered", price: 420, category: "Agriculture", sellerId: "u-8", cooperativeId: "c-2", location: "Wayanad, Kerala", rating: 4.9, ratingCount: 143, availability: "Limited" as const, stock: 10, imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80", materials: ["Raw honey"], tags: ["honey", "organic"], description: "Raw wildflower honey from natural forest beehives. 500g jar." },
    { id: "p-10", name: "Digital Marketing Starter Package", price: 1499, category: "Digital Services", sellerId: "u-6", cooperativeId: "c-1", location: "Trichy, Tamil Nadu", rating: 4.8, ratingCount: 33, availability: "In_Stock" as const, stock: 99, featured: true, imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80", tags: ["digital marketing", "services"], description: "A 2-week package to set up your online store and launch your first campaign." },
    { id: "p-11", name: "Embroidery Workshop (Group)", price: 1200, category: "Local Services", sellerId: "u-2", cooperativeId: "c-1", location: "Madurai, Tamil Nadu", rating: 4.9, ratingCount: 27, availability: "Limited" as const, stock: 4, imageUrl: "https://images.unsplash.com/photo-1557892867-9e8a7343db48?w=600&q=80", tags: ["workshop", "training"], description: "4-day hands-on mirror work and chain stitch embroidery workshop." },
    { id: "p-12", name: "Handwoven Cotton Stole", price: 549, category: "Clothing", sellerId: "u-1", cooperativeId: "c-1", location: "Coimbatore, Tamil Nadu", rating: 4.7, ratingCount: 48, availability: "In_Stock" as const, stock: 18, imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80", materials: ["Handspun cotton"], tags: ["stole", "cotton"], description: "Lightweight, breathable handwoven cotton stole with tassel ends." },
  ];
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        imageUrl: p.imageUrl,
        sellerId: p.sellerId,
        cooperativeId: p.cooperativeId ?? null,
        location: p.location,
        rating: p.rating,
        ratingCount: p.ratingCount,
        availability: p.availability,
        stock: p.stock,
        status: "active",
        featured: p.featured ?? false,
        materials: p.materials ?? [],
        tags: p.tags ?? [],
      },
    });
  }
  console.log(`  ✓ ${products.length} products`);

  // ── Orders ──
  const orders = [
    { id: "ord-1001", userId: "u-3", customerName: "Saroja Krishnan", total: 360, status: "delivered" as const, delivery: "Coimbatore", placedAt: new Date("2025-08-02"), items: [{ productId: "p-3", productName: "Organic Turmeric Powder", price: 180, quantity: 2 }] },
    { id: "ord-1002", userId: "u-1", customerName: "Lakshmi Venkatesan", total: 1947, status: "shipped" as const, delivery: "Madurai", placedAt: new Date("2025-08-14"), items: [{ productId: "p-2", productName: "Mirror Work Embroidered Bag", price: 649, quantity: 3 }] },
    { id: "ord-1003", userId: "u-5", customerName: "Anitha Raja", total: 900, status: "processing" as const, delivery: "Chennai", placedAt: new Date("2025-08-20"), items: [{ productId: "p-4", productName: "Handmade Aromatic Candle Set", price: 450, quantity: 2 }] },
    { id: "ord-1004", userId: "u-2", customerName: "Meena Devi", total: 549, status: "pending" as const, delivery: "Madurai", placedAt: new Date("2025-08-25"), items: [{ productId: "p-12", productName: "Handwoven Cotton Stole", price: 549, quantity: 1 }] },
  ];
  for (const o of orders) {
    await prisma.order.create({
      data: {
        id: o.id,
        userId: o.userId,
        customerName: o.customerName,
        total: o.total,
        status: o.status,
        delivery: o.delivery,
        placedAt: o.placedAt,
        items: {
          create: o.items.map((i) => {
            const product = products.find((p) => p.id === i.productId)!;
            return { productId: i.productId, productName: i.productName, price: i.price, quantity: i.quantity, imageUrl: product.imageUrl };
          }),
        },
      },
    });
  }
  console.log(`  ✓ ${orders.length} orders`);

  // ── Transactions / Savings / Loans / Repayments ──
  await prisma.transaction.createMany({
    data: [
      { userId: "u-1", type: "savings", amount: 500, description: "Weekly savings contribution", date: new Date("2025-08-01"), authorizedBy: "u-3" },
      { userId: "u-1", type: "sale", amount: 1947, description: "Order ord-1002 payout", date: new Date("2025-08-15") },
      { userId: "u-1", type: "repayment", amount: 800, description: "Loan EMI — July", date: new Date("2025-08-05"), authorizedBy: "u-3" },
      { userId: "u-1", type: "savings", amount: 500, description: "Weekly savings contribution", date: new Date("2025-08-08") },
      { userId: "u-1", type: "savings", amount: 500, description: "Weekly savings contribution", date: new Date("2025-08-15") },
      { userId: "u-1", type: "contribution", amount: 200, description: "Festival fund contribution", date: new Date("2025-08-18") },
      { userId: "u-2", type: "savings", amount: 500, description: "Weekly savings contribution", date: new Date("2025-08-01") },
      { userId: "u-2", type: "savings", amount: 500, description: "Weekly savings contribution", date: new Date("2025-08-08") },
      { userId: "u-2", type: "sale", amount: 549, description: "Order ord-1004 payout", date: new Date("2025-08-26") },
      { userId: "u-3", type: "loan", amount: 15000, description: "Loan issued — loom upgrade", date: new Date("2025-04-10") },
    ],
  });

  const savingsRows = [
    { userId: "u-1", date: "2025-07-04", amount: 500, channel: "Cash" },
    { userId: "u-1", date: "2025-07-11", amount: 500, channel: "Digital" },
    { userId: "u-1", date: "2025-07-18", amount: 500, channel: "Digital" },
    { userId: "u-1", date: "2025-07-25", amount: 500, channel: "Cash" },
    { userId: "u-1", date: "2025-08-01", amount: 500, channel: "Digital" },
    { userId: "u-1", date: "2025-08-08", amount: 500, channel: "Digital" },
    { userId: "u-1", date: "2025-08-15", amount: 500, channel: "Cash" },
    { userId: "u-1", date: "2025-08-22", amount: 500, channel: "Digital" },
    { userId: "u-1", date: "2025-08-29", amount: 500, channel: "Digital" },
  ];
  await prisma.savingsRecord.createMany({
    data: savingsRows.map((s) => ({ ...s, date: new Date(s.date) })),
  });

  await prisma.loan.create({
    data: { id: "l-1", userId: "u-1", principal: 15000, balance: 6600, interestRate: 12, issuedAt: new Date("2025-03-10"), purpose: "New tailoring machine and fabric stock", status: "active" },
  });
  await prisma.loan.create({
    data: { id: "l-2", userId: "u-2", principal: 8000, balance: 0, interestRate: 12, issuedAt: new Date("2025-01-15"), purpose: "Embroidery thread and material", status: "closed" },
  });

  await prisma.repayment.createMany({
    data: [
      { loanId: "l-1", userId: "u-1", amount: 800, date: new Date("2025-04-05") },
      { loanId: "l-1", userId: "u-1", amount: 800, date: new Date("2025-05-05") },
      { loanId: "l-1", userId: "u-1", amount: 800, date: new Date("2025-06-05") },
      { loanId: "l-1", userId: "u-1", amount: 800, date: new Date("2025-07-05") },
      { loanId: "l-1", userId: "u-1", amount: 800, date: new Date("2025-08-05") },
      { loanId: "l-2", userId: "u-2", amount: 1000, date: new Date("2025-02-10") },
      { loanId: "l-2", userId: "u-2", amount: 1000, date: new Date("2025-03-10") },
      { loanId: "l-2", userId: "u-2", amount: 1000, date: new Date("2025-04-10") },
      { loanId: "l-2", userId: "u-2", amount: 1000, date: new Date("2025-05-10") },
      { loanId: "l-2", userId: "u-2", amount: 1000, date: new Date("2025-06-10") },
    ],
  });
  console.log("  ✓ transactions, savings, loans, repayments");

  // ── Community ──
  const posts = [
    { id: "post-1", authorId: "u-1", content: "So happy to share that my custom kurta sets crossed 100 orders this month! If any of you do embroidery work, let's team up for festival orders.", tags: ["achievement", "collaboration"], likes: 34, type: "achievement" as const, createdAt: new Date("2025-08-10T09:00:00Z"), comments: [{ authorId: "u-2", content: "Congrats Lakshmi! Happy to contribute mirror work on your festive pieces." }, { authorId: "u-6", content: "Amazing! Let me know when you want a promotional post." }] },
    { id: "post-2", authorId: "u-6", content: "Quick tip: Take your product photos in natural morning light near a window. No fancy gear needed.", tags: ["tip", "marketing"], likes: 21, type: "post" as const, createdAt: new Date("2025-08-08T14:20:00Z"), comments: [] },
    { id: "post-3", authorId: "u-5", content: "I have 20 kg of dried water hyacinth stems ready this month. Looking for someone who can help photograph my baskets for better listings. Happy to trade products!", tags: ["request", "collaboration"], likes: 12, type: "opportunity" as const, createdAt: new Date("2025-08-09T08:00:00Z"), comments: [{ authorId: "u-6", content: "I photograph products on weekends. Happy to do a trade!" }] },
    { id: "post-4", authorId: "u-3", content: "Workshop this Saturday: 'Digital Records Made Simple' — learn to track savings and loans in your phone. Open to all cooperative members.", tags: ["workshop", "finance"], likes: 18, type: "workshop" as const, createdAt: new Date("2025-08-07T10:00:00Z"), comments: [{ authorId: "u-1", content: "Will definitely attend!" }] },
    { id: "post-5", authorId: "u-4", content: "Anyone baking for festive orders? I need reliable baking partners in Jaipur for Diwali sweet boxes.", tags: ["opportunity", "baking"], likes: 9, type: "opportunity" as const, createdAt: new Date("2025-08-05T16:30:00Z"), comments: [] },
  ];
  for (const p of posts) {
    await prisma.post.create({
      data: {
        id: p.id,
        authorId: p.authorId,
        content: p.content,
        tags: p.tags,
        likes: p.likes,
        type: p.type,
        createdAt: p.createdAt,
        comments: { create: p.comments.map((c) => ({ authorId: c.authorId, content: c.content })) },
      },
    });
  }
  console.log(`  ✓ ${posts.length} community posts`);

  // ── Skill matches ──
  await prisma.matchSuggestion.createMany({
    data: [
      { userName: "Meena Devi", avatarUrl: avatar("Meena Devi"), location: "Madurai, Tamil Nadu", skills: ["Embroidery", "Mirror Work"], interest: "Tailoring", matchScore: 92, opportunity: "Custom ethnic wear collaboration — your tailoring with her embroidery." },
      { userName: "Kavitha Murugan", avatarUrl: avatar("Kavitha Murugan"), location: "Trichy, Tamil Nadu", skills: ["Digital Marketing", "Content Writing"], interest: "Product Photography", matchScore: 86, opportunity: "Promote your store online while you focus on crafting." },
      { userName: "Anitha Raja", avatarUrl: avatar("Anitha Raja"), location: "Chennai, Tamil Nadu", skills: ["Basket Weaving", "Candle Making"], interest: "Packaging", matchScore: 74, opportunity: "Bundle gift sets: her baskets with your handcrafted products." },
      { userName: "Deepa Menon", avatarUrl: avatar("Deepa Menon"), location: "Wayanad, Kerala", skills: ["Agriculture", "Food Processing"], interest: "Organic Products", matchScore: 69, opportunity: "Source organic ingredients directly from her farm." },
    ],
  });

  // ── Notifications for the demo member ──
  await prisma.notification.createMany({
    data: [
      { userId: "u-1", title: "New order received", body: "mirror bag x3 ordered by Saroja Krishnan (ord-1002).", read: false, type: "order", createdAt: new Date("2025-08-14T10:00:00Z") },
      { userId: "u-1", title: "New skill match found", body: "Meena Devi (Embroidery) could complement your tailoring.", read: false, type: "match", createdAt: new Date("2025-08-13T09:00:00Z") },
      { userId: "u-1", title: "Loan EMI due", body: "Your next repayment of ₹800 is due on 5 Sep.", read: true, type: "finance", createdAt: new Date("2025-08-12T08:00:00Z") },
      { userId: "u-1", title: "Savings contribution recorded", body: "₹500 added to your savings on 29 Aug.", read: true, type: "finance", createdAt: new Date("2025-08-29T18:00:00Z") },
    ],
  });

  console.log("\nSeed complete.");
  console.log("Demo login: lakshmi@demo.herway / HerWay@123");
  console.log("Admin login: saroja@demo.herway / HerWay@123  (cooperative admin)");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
