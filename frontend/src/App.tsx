import { Route, Routes } from "react-router-dom";
import { PublicLayout, AuthLayout } from "@/components/layout/PublicLayout";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AIAssistantPublic } from "@/components/ai/ChatInterface";
import { Community } from "@/components/community/CommunityFeed";

import { Home } from "@/pages/Home";
import { Marketplace } from "@/pages/Marketplace";
import { ProductDetail } from "@/pages/ProductDetail";
import { Checkout } from "@/pages/Checkout";
import { SkillConnect } from "@/pages/SkillConnect";
import { CooperativeNetwork } from "@/pages/CooperativeNetwork";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { About } from "@/pages/About";
import { SuccessStories } from "@/pages/SuccessStories";
import { Contact } from "@/pages/Contact";
import { LegalPage, Help } from "@/pages/Legal";
import { NotFound } from "@/pages/NotFound";

import { Login } from "@/pages/auth/Login";
import { SignUp } from "@/pages/auth/SignUp";
import { ForgotPassword } from "@/pages/auth/ForgotPassword";
import { RoleSelection } from "@/pages/auth/RoleSelection";

import { MemberDashboard } from "@/pages/dashboard/MemberDashboard";
import { Notifications } from "@/pages/dashboard/Notifications";
import { MyProducts } from "@/pages/dashboard/MyProducts";
import { AddProduct } from "@/pages/dashboard/AddProduct";
import { Orders } from "@/pages/dashboard/Orders";
import { FinancialRecords } from "@/pages/dashboard/FinancialRecords";
import { SavingsLoans } from "@/pages/dashboard/SavingsLoans";
import { SkillProfile } from "@/pages/dashboard/SkillProfile";
import { SkillMatching } from "@/pages/dashboard/SkillMatching";
import { MyProfile } from "@/pages/dashboard/MyProfile";
import { Settings } from "@/pages/dashboard/Settings";
import { Wishlist } from "@/pages/dashboard/Wishlist";
import { DashboardCommunity, DashboardAiAssistant } from "@/pages/dashboard/CommunityAndAi";

import { CooperativeDashboard } from "@/pages/cooperative/CooperativeDashboard";
import { Members } from "@/pages/cooperative/Members";
import { CoopProducts } from "@/pages/cooperative/CoopProducts";
import { CoopOrders } from "@/pages/cooperative/CoopOrders";
import { SkillNetwork } from "@/pages/cooperative/SkillNetwork";
import { FinancialOverview } from "@/pages/cooperative/FinancialOverview";
import { Reports } from "@/pages/cooperative/Reports";
import { Analytics } from "@/pages/cooperative/Analytics";
import { CoopTransactions } from "@/pages/cooperative/CoopTransactions";

export function App() {
  return (
    <Routes>
      {/* ── Public site ─────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="marketplace/:id" element={<ProductDetail />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="skill-connect" element={<SkillConnect />} />
        <Route path="cooperatives" element={<CooperativeNetwork />} />
        <Route path="community" element={<Community />} />
        <Route path="ai-assistant" element={<AIAssistantPublic />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="about" element={<About />} />
        <Route path="success-stories" element={<SuccessStories />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<LegalPage kind="privacy" />} />
        <Route path="terms" element={<LegalPage kind="terms" />} />
        <Route path="help" element={<Help />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ── Auth ────────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="role-selection" element={<RoleSelection />} />
      </Route>

      {/* ── Member dashboard ────────────────────────────────── */}
      <Route element={<ProtectedRoute roles={["member"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="dashboard" element={<MemberDashboard />} />
          <Route path="dashboard/notifications" element={<Notifications />} />
          <Route path="dashboard/products" element={<MyProducts />} />
          <Route path="dashboard/products/new" element={<AddProduct />} />
          <Route path="dashboard/orders" element={<Orders />} />
          <Route path="dashboard/finance" element={<FinancialRecords />} />
          <Route path="dashboard/finance/savings-loans" element={<SavingsLoans />} />
          <Route path="dashboard/skills" element={<SkillProfile />} />
          <Route path="dashboard/skills/matching" element={<SkillMatching />} />
          <Route path="dashboard/community" element={<DashboardCommunity />} />
          <Route path="dashboard/ai-assistant" element={<DashboardAiAssistant />} />
          <Route path="dashboard/profile" element={<MyProfile />} />
          <Route path="dashboard/settings" element={<Settings />} />
          <Route path="dashboard/wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* ── Cooperative / admin dashboard ───────────────────── */}
      <Route element={<ProtectedRoute roles={["cooperative_admin", "platform_admin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="cooperative" element={<CooperativeDashboard />} />
          <Route path="cooperative/analytics" element={<Analytics />} />
          <Route path="cooperative/members" element={<Members />} />
          <Route path="cooperative/products" element={<CoopProducts />} />
          <Route path="cooperative/orders" element={<CoopOrders />} />
          <Route path="cooperative/skills" element={<SkillNetwork />} />
          <Route path="cooperative/finance" element={<FinancialOverview />} />
          <Route path="cooperative/reports" element={<Reports />} />
          <Route path="cooperative/transactions" element={<CoopTransactions />} />
        </Route>
      </Route>
    </Routes>
  );
}