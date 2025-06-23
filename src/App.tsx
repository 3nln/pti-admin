import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Vehicles from "./pages/Vehicles";
import PTISessions from "./pages/PTISessions";
import Statistics from "./pages/Statistics";
import Driver from "./pages/Driver";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Role-based authentication check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("pti_auth") === "true";
  const userRole = localStorage.getItem("pti_role");

  if (!isAuthenticated && window.location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && window.location.pathname === "/login") {
    // Redirect based on role
    if (userRole === "driver") {
      return <Navigate to="/driver" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <ProtectedRoute>
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicles"
              element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pti-sessions"
              element={
                <ProtectedRoute>
                  <PTISessions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />

            {/* Driver Route */}
            <Route
              path="/driver"
              element={
                <ProtectedRoute>
                  <Driver />
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route
              path="/"
              element={
                <Navigate
                  to={
                    localStorage.getItem("pti_role") === "driver"
                      ? "/driver"
                      : "/dashboard"
                  }
                  replace
                />
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
