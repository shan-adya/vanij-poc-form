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

export default function App() {
  return (
    <ServiceProvider>
      <FormProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
                <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<ServiceSelection />} />
              <Route path="details" element={<Details />} />
              <Route path="terms" element={<Terms />} />
              <Route path="summary" element={<Summary />} />
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              
            </Route>
          </Routes>
        </BrowserRouter>
      </FormProvider>
    </ServiceProvider>
  );
}
