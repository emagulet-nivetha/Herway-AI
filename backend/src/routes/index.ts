import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import productsRoutes from "./products.routes";
import ordersRoutes from "./orders.routes";
import cooperativesRoutes from "./cooperatives.routes";
import communityRoutes from "./community.routes";
import notificationsRoutes from "./notifications.routes";
import matchesRoutes from "./matches.routes";
import analyticsRoutes from "./analytics.routes";
import aiRoutes from "./ai.routes";
import transactionsRoutes from "./transactions.routes";
import { savingsRouter, loansRouter, repaymentsRouter } from "./finance.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/products", productsRoutes);
router.use("/orders", ordersRoutes);
router.use("/cooperatives", cooperativesRoutes);
router.use("/community", communityRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/matches", matchesRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/ai", aiRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/savings", savingsRouter);
router.use("/loans", loansRouter);
router.use("/repayments", repaymentsRouter);

export default router;
