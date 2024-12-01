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
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/client" replace />;
  }

  return <Outlet />;
}

export function ClientRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export function AuthRoute() {
  const { user } = useAuth();

  if (user) {
    // Redirect based on role
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/client" replace />;
  }

  return <Outlet />;
}

export default function App() {
  return (
    <ServiceProvider>
      <FormProvider>
        <BrowserRouter basename="/vanij-poc">
          <AuthProvider>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <Routes>
              {/* Public Routes */}
              <Route element={<AuthRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Layout />}>
                  <Route path="/" element={<ProjectDetails />} />
                  {/* <Route path="services" element={<ServiceSelection />} /> */}
                  <Route path="details" element={<Details />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="summary" element={<Summary />} />
                </Route>
              </Route>
              
              {/* Protected Client Routes */}
              <Route element={<ClientRoute />}>
                <Route path="/client" element={<ClientLayout />}>
                  <Route index element={<ClientDashboard />} />
                  {/* <Route path="profile" element={<>ClientProfile</>} /> */}
                  <Route path="projects/:id" element={<ClientProjectView />} />
                </Route>
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminIndex />}>
                  <Route index element={<AdminDashboardNew />} />
                  <Route path="projects/new" element={<CreateProject />} />
                  <Route path="projects/:id" element={<ProjectView />} />
                  <Route path="projects/:id/edit" element={<CreateProject />} />
                </Route>
              </Route>

              {/* Catch all route - 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </FormProvider>
    </ServiceProvider>
  );
}
