
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { JobProvider } from './contexts/JobContext';
import Navbar from './components/Navbar';
import Index from "./pages/Index";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <JobProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/add" element={<AddJob />} />
                <Route path="/edit/:id" element={<EditJob />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </JobProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
