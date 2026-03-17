import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Plans from "./pages/Plans";
import Contact from "./pages/Contact";
import TrainingTips from "./pages/TrainingTips";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import BookPage from "./pages/Book";
import ConsultationAuth from "./pages/consultation/Auth";
import ConsultationForm from "./pages/consultation/Form";
import ConsultationNext from "./pages/consultation/Next";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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
        <Routes>
          {/* Public routes with navigation */}
          <Route path="/" element={withNav(<Index />)} />
          <Route path="/plans" element={withNav(<Plans />)} />
          <Route path="/contact" element={withNav(<Contact />)} />
          <Route path="/training-tips" element={withNav(<TrainingTips />)} />
          <Route path="/terms" element={withNav(<Terms />)} />

          {/* Consultation onboarding flow (no nav link) */}
          <Route path="/consultation" element={<ConsultationAuth />} />
          <Route path="/consultation/auth" element={<ConsultationAuth />} />
          <Route path="/consultation/form" element={<ConsultationForm />} />
          <Route path="/consultation/next" element={<ConsultationNext />} />

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
