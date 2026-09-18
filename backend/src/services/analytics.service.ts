import { prisma } from "../config/prisma";

export function monthLabel(date: Date): string {
  return date.toLocaleString("en", { month: "short" });
}

/** Per-member financial activity record. Explicitly NOT a credit score. */
export async function memberFinancialSummary(userId: string) {
  const [savings, activeLoan, repayments, salesAgg] = await Promise.all([
    prisma.savingsRecord.findMany({ where: { userId }, orderBy: { date: "asc" } }),
    prisma.loan.findFirst({ where: { userId, status: "active" } }),
    prisma.repayment.findMany({ where: { userId } }),
    prisma.transaction.aggregate({
      where: { userId, type: "sale" },
      _sum: { amount: true },
    }),
  ]);

  const byMonth = new Map<string, number>();
  savings.forEach((s) => {
    const m = monthLabel(s.date);
    byMonth.set(m, (byMonth.get(m) || 0) + s.amount);
  });
  let running = 0;
  const savingsTrend = Array.from(byMonth.entries()).map(([month, amount]) => {
    running += amount;
    return { month, amount: running };
  });

  const totalRepaid = repayments.reduce((s, r) => s + r.amount, 0);

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });

  return {
    totalSavings: savings.reduce((s, x) => s + x.amount, 0),
    loanBalance: activeLoan?.balance ?? 0,
    totalRepaid,
    monthlyContribution: 2000,
    totalSales: salesAgg._sum.amount ?? 0,
    savingsTrend,
    repaymentProgress: activeLoan
      ? [
          { label: "Repaid", value: totalRepaid },
          { label: "Remaining", value: activeLoan.balance },
        ]
      : [
          { label: "Repaid", value: 1 },
          { label: "Remaining", value: 0 },
        ],
    transactions: transactions.map((t) => ({
      id: t.id,
      userId: t.userId,
      type: t.type,
      amount: t.amount,
      description: t.description,
      date: t.date.toISOString(),
      authorizedBy: t.authorizedBy ?? undefined,
    })),
  };
}

/** Cooperative-wide analytics (demo-grade aggregation of real rows). */
export async function cooperativeAnalytics() {
  const [orders, members, skills, savings, loans] = await Promise.all([
    prisma.order.findMany({ include: { items: true } }),
    prisma.user.count(),
    prisma.userSkill.findMany({ include: { skill: true } }),
    prisma.savingsRecord.findMany({ orderBy: { date: "asc" } }),
    prisma.loan.findMany({ where: { status: "active" } }),
  ]);

  const totalSales = orders.reduce((s, o) => s + o.total, 0);

  const perf = new Map<string, { name: string; sales: number; revenue: number }>();
  orders.forEach((o) =>
    o.items.forEach((i) => {
      const row = perf.get(i.productName) || { name: i.productName, sales: 0, revenue: 0 };
      row.sales += i.quantity;
      row.revenue += i.price * i.quantity;
      perf.set(i.productName, row);
    })
  );

  const skillDist = new Map<string, number>();
  skills.forEach((s) => {
    const key = s.skill.category || s.skill.name;
    skillDist.set(key, (skillDist.get(key) || 0) + 1);
  });

  const byMonth = new Map<string, number>();
  savings.forEach((s) => {
    const m = monthLabel(s.date);
    byMonth.set(m, (byMonth.get(m) || 0) + s.amount);
  });
  let running = 0;
  const savingsTrend = Array.from(byMonth.entries()).map(([month, amount]) => {
    running += amount;
    return { month, amount: running };
  });

  const totalLoanValue = loans.reduce((s, l) => s + l.principal, 0);
  const outstanding = loans.reduce((s, l) => s + l.balance, 0);
  const loanRecoveryRate =
    totalLoanValue > 0 ? Math.round(((totalLoanValue - outstanding) / totalLoanValue) * 100) : 100;

  return {
    business: {
      totalSales,
      totalOrders: orders.length,
      productPerformance: Array.from(perf.values()).sort((a, b) => b.sales - a.sales),
    },
    community: {
      totalMembers: members,
      skillDistribution: Array.from(skillDist.entries()).map(([skill, count]) => ({ skill, count })),
      collaborations: Math.max(skillDist.size * 2, 1),
    },
    financial: {
      totalSavings: savings.reduce((s, x) => s + x.amount, 0),
      totalLoans: totalLoanValue,
      savingsTrend,
      loanRecoveryRate,
    },
  };
}
