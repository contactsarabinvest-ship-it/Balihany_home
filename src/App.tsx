import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import ConciergeDirectory from "./pages/ConciergeDirectory";
import ConciergeProfile from "./pages/ConciergeProfile";
import DesignersDirectory from "./pages/DesignersDirectory";
import DesignerProfile from "./pages/DesignerProfile";
import ProfitCalculator from "./pages/ProfitCalculator";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import ConciergeSignup from "./pages/ConciergeSignup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/concierge" element={<ConciergeDirectory />} />
                <Route path="/concierge/:id" element={<ConciergeProfile />} />
                <Route path="/designers" element={<DesignersDirectory />} />
                <Route path="/designers/:id" element={<DesignerProfile />} />
                <Route path="/calculator" element={<ProfitCalculator />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/concierge-signup" element={<ConciergeSignup />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
