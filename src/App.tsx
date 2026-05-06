import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/ui/motion";
import ScrollToTop from "./components/layout/ScrollToTop";
import { ThemeProvider } from "@/hooks/useTheme";
import { AppProvider } from "@/state/AppContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleRoute } from "@/components/auth/RoleRoute";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import History from "./pages/History";
import TeacherUploadBatch from "./pages/teacher/UploadBatch";
import TeacherEditResults from "./pages/teacher/EditResults";
import TeacherBilling from "./pages/teacher/Billing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<FadeIn><Landing /></FadeIn>} />
        <Route
          path="/upload"
          element={
            <FadeIn>
              <RoleRoute allow={["student"]}>
                <Upload />
              </RoleRoute>
            </FadeIn>
          }
        />
        <Route
          path="/teacher/upload-batch"
          element={
            <FadeIn>
              <RoleRoute allow={["teacher"]}>
                <TeacherUploadBatch />
              </RoleRoute>
            </FadeIn>
          }
        />
        <Route
          path="/results"
          element={
            <FadeIn>
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            </FadeIn>
          }
        />
        <Route
          path="/history"
          element={
            <FadeIn>
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            </FadeIn>
          }
        />
        <Route
          path="/teacher/edit-results"
          element={
            <FadeIn>
              <RoleRoute allow={["teacher"]}>
                <TeacherEditResults />
              </RoleRoute>
            </FadeIn>
          }
        />
        <Route
          path="/teacher/billing"
          element={
            <FadeIn>
              <RoleRoute allow={["teacher"]}>
                <TeacherBilling />
              </RoleRoute>
            </FadeIn>
          }
        />
        <Route path="/login" element={<FadeIn><Login /></FadeIn>} />
        <Route path="/signup" element={<FadeIn><Signup /></FadeIn>} />
        <Route path="*" element={<FadeIn><NotFound /></FadeIn>} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
