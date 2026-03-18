import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ForbiddenPage from "@/pages/ForbiddenPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  departmentRoute?: boolean;
}

const ProtectedRoute = ({ children, adminOnly, departmentRoute }: ProtectedRouteProps) => {
  const { isLoggedIn, isAdmin, canAccessDepartment } = useAuth();
  const { id } = useParams();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <ForbiddenPage />;
  if (departmentRoute && id && !canAccessDepartment(Number(id))) return <ForbiddenPage />;

  return <>{children}</>;
};

export default ProtectedRoute;
