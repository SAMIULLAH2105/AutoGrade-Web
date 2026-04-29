import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/upload"
                element={
                  <RoleRoute allow={["student"]}>
                    <Upload />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/upload-batch"
                element={
                  <RoleRoute allow={["teacher"]}>
                    <TeacherUploadBatch />
                  </RoleRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <Results />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/edit-results"
                element={
                  <RoleRoute allow={["teacher"]}>
                    <TeacherEditResults />
                  </RoleRoute>
                }
              />
              <Route
                path="/teacher/billing"
                element={
                  <RoleRoute allow={["teacher"]}>
                    <TeacherBilling />
                  </RoleRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
