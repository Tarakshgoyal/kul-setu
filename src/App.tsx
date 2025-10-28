import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Register from "./pages/Register";
import RegisterNew from "./pages/RegisterNew";
import ComprehensiveRegister from "./pages/ComprehensiveRegister";
import Search from "./pages/Search";
import FamilyTree from "./pages/FamilyTree";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Rituals from "./pages/Rituals";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import PanditDashboard from "./pages/PanditDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<ComprehensiveRegister />} />
            <Route path="/register-simple" element={<RegisterNew />} />
            <Route path="/register-old" element={<Register />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tree" element={<FamilyTree />} />
            <Route path="/rituals" element={<Rituals />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/pandit/dashboard" element={<PanditDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
