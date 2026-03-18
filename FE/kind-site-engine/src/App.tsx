import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EquipmentProvider } from "@/contexts/EquipmentContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import EquipmentList from "./pages/EquipmentList";
import DepartmentPage from "./pages/DepartmentPage";
import UserManagement from "./pages/UserManagement";
import DepartmentManagement from "./pages/DepartmentManagement";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <EquipmentProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/danh-sach" element={<ProtectedRoute><EquipmentList /></ProtectedRoute>} />
              <Route path="/bao-cao" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
              <Route path="/phong-ban/:id" element={<ProtectedRoute departmentRoute><DepartmentPage /></ProtectedRoute>} />
              <Route path="/quan-ly-tai-khoan" element={<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>} />
              <Route path="/quan-ly-phong-ban" element={<ProtectedRoute adminOnly><DepartmentManagement /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EquipmentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
