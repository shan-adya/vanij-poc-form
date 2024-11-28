import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ServiceSelection from '@/pages/ServiceSelection';
import DetailsForm from '@/pages/DetailsForm';
import Summary from '@/pages/Summary';
import Dashboard from '@/pages/Dashboard';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { ServiceProvider } from '@/contexts/ServiceContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ServiceProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<ServiceSelection />} />
              <Route path="/details" element={<DetailsForm />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout>
          <Toaster />
        </ServiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;