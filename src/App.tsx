import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import Deposit from "./pages/dashboard/Deposit";
import Withdraw from "./pages/dashboard/Withdraw";
import Transactions from "./pages/dashboard/Transactions";
import Investments from "./pages/dashboard/Investments";
import Plans from "./pages/dashboard/Plans";
import Profile from "./pages/dashboard/Profile";
import Referrals from "./pages/dashboard/Referrals";
import KYC from "./pages/dashboard/KYC";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardOverview />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="investments" element={<Investments />} />
              <Route path="plans" element={<Plans />} />
              <Route path="profile" element={<Profile />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="kyc" element={<KYC />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
