import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BackgroundGradient from '@/components/BackgroundGradient';
import ServiceSelection from './pages/ServiceSelection';
import Details from './pages/DetailsForm';
import Terms from './pages/Terms';
import Summary from './pages/Summary';
import Layout from './components/Layout';
import { FormProvider } from '@/contexts/FormContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <BackgroundGradient />
      <div className="min-h-screen relative">
        <Layout>
          <FormProvider>
            <div className="relative z-10">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ServiceSelection />} />
                <Route path="/details" element={<Details />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/summary" element={<Summary />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
          </FormProvider>
        </Layout>
      </div>
    </BrowserRouter>
  );
}