import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserTypeModal } from "@/components/UserTypeModal";
import { AuthModalProvider } from "@/contexts/AuthModalContext";
import { LoginModal } from "@/components/LoginModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import ConciergeDirectory from "./pages/ConciergeDirectory";
import ConciergeProfile from "./pages/ConciergeProfile";
import MenageDirectory from "./pages/MenageDirectory";
import MenageProfile from "./pages/MenageProfile";
import DesignersDirectory from "./pages/DesignersDirectory";
import DesignerProfile from "./pages/DesignerProfile";
import ProfitCalculator from "./pages/ProfitCalculator";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import ConciergeSignup from "./pages/ConciergeSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Search from "./pages/Search";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <AuthModalProvider>
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/concierge" element={<ConciergeDirectory />} />
                  <Route path="/concierge/:id" element={<ConciergeProfile />} />
                  <Route path="/menage" element={<MenageDirectory />} />
                  <Route path="/menage/:id" element={<MenageProfile />} />
                  <Route path="/designers" element={<DesignersDirectory />} />
                  <Route path="/designers/:id" element={<DesignerProfile />} />
                  <Route path="/calculator" element={<ProfitCalculator />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/concierge-signup" element={<ConciergeSignup />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/purchase-success" element={<PurchaseSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </div>
            <Footer />
            <LoginModal />
            <UserTypeModal />
          </div>
        </BrowserRouter>
        </AuthModalProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
