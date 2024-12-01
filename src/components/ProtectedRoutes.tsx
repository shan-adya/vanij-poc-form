import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AdminRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/vanij-poc/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/vanij-poc/client" replace />;
  }

  return <Outlet />;
}

export function ClientRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/vanij-poc/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/vanij-poc/admin" replace />;
  }

  return <Outlet />;
}

export function AuthRoute() {
  const { user } = useAuth();

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/vanij-poc/admin" replace />;
    }
    return <Navigate to="/vanij-poc/client" replace />;
  }

  return <Outlet />;
} 