import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { AuthProvider } from '@/contexts/AuthContext';
import AdminDashboardNew from "./pages/admin/AdminDashboardNew";
import CreateProject from "./pages/admin/CreateProject";
import ProjectView from "./pages/admin/ProjectView";
import { Toaster } from "sonner";
import ProjectDetails from "./pages/ProjectDetails";
import ClientLayout from "./pages/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
// import ClientProfile from "./pages/client/ClientProfile";
import ClientProjectView from "./pages/client/ClientProjectView";

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
                <Route path="/" element={<ProjectDetails />} />
                <Route path="services" element={<ServiceSelection />} />
                <Route path="details" element={<Details />} />
                <Route path="terms" element={<Terms />} />
                <Route path="summary" element={<Summary />} />
              </Route>
              
              {/* Client Dashboard Routes */}
              <Route path="/client" element={<ClientLayout />}>
                <Route index element={<ClientDashboard />} />
                <Route path="profile" element={<>ClientProfile </>} />
                <Route path="projects/:id" element={<ClientProjectView />} />
              </Route>

              {/* Admin Routes */}
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
