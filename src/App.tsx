import { BrowserRouter, Route, Routes } from "react-router-dom";
import ServiceSelection from "./pages/ServiceSelection";
import Details from "./pages/DetailsForm";
import Terms from "./pages/Terms";
import Summary from "./pages/Summary";
import Layout from "./components/Layout";
import { FormProvider } from "@/contexts/FormContext";
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import { ServiceProvider } from "./contexts/ServiceContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./pages/admin/AdminLayout";
import Login from './pages/Login';
import AdminIndex from "./pages/admin/AdminIndex";
import { AuthProvider } from '@/contexts/AuthContext';
import AdminDashboardNew from "./pages/admin/AdminDashboardNew";
import CreateProject from "./pages/admin/CreateProject";
import ProjectView from "./pages/admin/ProjectView";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ServiceProvider>
      <FormProvider>
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Toaster position="top-center" richColors />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<ServiceSelection />} />
                <Route path="details" element={<Details />} />
                <Route path="terms" element={<Terms />} />
                <Route path="summary" element={<Summary />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
              {/* <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
              </Route> */}
              <Route path="/admin" element={<AdminIndex />}>
                <Route index element={<AdminDashboardNew />} />
                <Route path="projects/new" element={<CreateProject />} />
                <Route path="projects/:id" element={<ProjectView />} />
                <Route path="projects/:id/edit" element={<CreateProject />} />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </FormProvider>
    </ServiceProvider>
  );
}
