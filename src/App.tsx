import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import ServiceSelection from "./pages/ServiceSelection";
import Details from "./pages/DetailsForm";
import Terms from "./pages/Terms";
import Summary from "./pages/Summary";
import Layout from "./components/Layout";
import { FormProvider } from "@/contexts/FormContext";
import ScrollToTop from "./components/ScrollToTop";
import { ServiceProvider } from "./contexts/ServiceContext";
import Login from './pages/Login';
import AdminIndex from "./pages/admin/AdminIndex";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import AdminDashboardNew from "./pages/admin/AdminDashboardNew";
import CreateProject from "./pages/admin/CreateProject";
import ProjectView from "./pages/admin/ProjectView";
import { Toaster } from "sonner";
import ProjectDetails from "./pages/ProjectDetails";
import ClientLayout from "./pages/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
// import ClientProfile from "./pages/client/ClientProfile";
import ClientProjectView from "./pages/client/ClientProjectView";

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
    // Redirect based on role
    if (user.role === "ADMIN") {
      return <Navigate to="/vanij-poc/admin" replace />;
    }
    return <Navigate to="/vanij-poc/client" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <ServiceProvider>
      <FormProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Public Routes */}
              <Route element={<AuthRoute />}>
                <Route path="/vanij-poc/login" element={<Login />} />
                <Route path="/vanij-poc" element={<Layout />}>
                  <Route path="/vanij-poc" element={<ProjectDetails />} />
                  <Route path="/vanij-poc/details" element={<Details />} />
                  <Route path="/vanij-poc/terms" element={<Terms />} />
                  <Route path="/vanij-poc/summary" element={<Summary />} />
                </Route>
              </Route>
              
              {/* Protected Client Routes */}
              <Route element={<ClientRoute />}>
                <Route path="/vanij-poc/client" element={<ClientLayout />}>
                  <Route index element={<ClientDashboard />} />
                  <Route path="projects/:id" element={<ClientProjectView />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/vanij-poc/admin" element={<AdminIndex />}>
                  <Route index element={<AdminDashboardNew />} />
                  <Route path="projects/new" element={<CreateProject />} />
                  <Route path="projects/:id" element={<ProjectView />} />
                  <Route path="projects/:id/edit" element={<CreateProject />} />
                </Route>
              </Route>

              {/* Catch all route - 404 */}
              <Route path="*" element={<Navigate to="/vanij-poc/login" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </FormProvider>
    </ServiceProvider>
  );
}
