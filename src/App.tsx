
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { JobProvider } from './contexts/JobContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Index from "./pages/Index";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import Search from "./pages/Search"; // Add the import for the new Search page
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Setup dark mode handling
  useEffect(() => {
    // On page load, check if user has dark mode preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && 
        window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <JobProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
                <Navbar />
                <div className="flex-1">
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    <Route path="/add" element={
                      <ProtectedRoute>
                        <AddJob />
                      </ProtectedRoute>
                    } />
                    <Route path="/edit/:id" element={
                      <ProtectedRoute>
                        <EditJob />
                      </ProtectedRoute>
                    } />
                    <Route path="/search" element={
                      <ProtectedRoute>
                        <Search />
                      </ProtectedRoute>
                    } />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                  </Routes>
                </div>
              </div>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </JobProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
