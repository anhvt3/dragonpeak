import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AutoRedirect from "./pages/AutoRedirect";
import MobileGame from "./pages/MobileGame";
import DesktopGame from "./pages/DesktopGame";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auto-detect device and redirect */}
          <Route path="/" element={<AutoRedirect />} />
          
          {/* Mobile-only UI */}
          <Route path="/mobile" element={<MobileGame />} />
          
          {/* Desktop-only UI */}
          <Route path="/desktop" element={<DesktopGame />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
