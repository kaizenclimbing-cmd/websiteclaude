import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Plans from "./pages/Plans";
import Kaizen from "./pages/Kaizen";
import Coaching from "./pages/Coaching";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import TrainingTips from "./pages/TrainingTips";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import BookPage from "./pages/Book";
import ConsultationAuth from "./pages/consultation/Auth";
import ConsultationForm from "./pages/consultation/Form";
import ConsultationNext from "./pages/consultation/Next";
import ConsultationOAuthCallback from "./pages/consultation/OAuthCallback";
import ResetPassword from "./pages/consultation/ResetPassword";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/consultation/PaymentSuccess";
import SixWeekPlan from "./pages/SixWeekPlan";
import SixWeekSignup from "./pages/SixWeekSignup";
import FingerGuideSlideUp from "./components/FingerGuideSlideUp";

const queryClient = new QueryClient();

const withNav = (element: React.ReactNode) => (
  <>
    <Navigation />
    {element}
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FingerGuideSlideUp />
        <Routes>
          {/* Public routes with navigation */}
          <Route path="/" element={<Index />} />
          <Route path="/home" element={withNav(<Home />)} />
          <Route path="/plans" element={withNav(<Plans />)} />
          <Route path="/kaizen" element={<Kaizen />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/coaching" element={withNav(<Coaching />)} />
          <Route path="/contact" element={withNav(<Contact />)} />
          <Route path="/training-tips" element={withNav(<TrainingTips />)} />
          <Route path="/sends" element={<Navigate to="/training-tips" replace />} />
          <Route path="/terms" element={withNav(<Terms />)} />

          {/* Consultation onboarding flow (no nav link) */}
          <Route path="/consultation" element={<ConsultationAuth />} />
          <Route path="/consultation/auth" element={<ConsultationAuth />} />
          <Route path="/consultation/oauth-callback" element={<ConsultationOAuthCallback />} />
          <Route path="/consultation/form" element={<ConsultationForm />} />
          <Route path="/consultation/next" element={<ConsultationNext />} />
          <Route path="/consultation/payment-success" element={<PaymentSuccess />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 6 Week Peak Plan flow */}
          <Route path="/plans/6-week" element={withNav(<SixWeekPlan />)} />
          <Route path="/plans/6-week/signup" element={<SixWeekSignup />} />

          {/* Hidden booking page (no nav link) */}
          <Route path="/book" element={<BookPage />} />

          {/* Admin routes (no public navigation) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
