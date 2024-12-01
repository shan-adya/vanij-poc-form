import { useLocation, Outlet } from 'react-router-dom';
import StepIndicator from './StepIndicator';

const STEPS = [
  {
    title: "Services",
    description: "Choose your services"
  },
  {
    title: "Details",
    description: "Fill in your information"
  },
  {
    title: "Terms",
    description: "Review terms"
  },
  {
    title: "Summary",
    description: "Confirm your request"
  }
];

export default function Layout() {
  const location = useLocation();
  const steps = [
    '/vanij-poc',
    '/vanij-poc/details',
    '/vanij-poc/terms',
    '/vanij-poc/summary'
  ];
  const currentStep = steps.indexOf(location.pathname) + 1;

  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden">
      {/* <div className="absolute inset-0 animated-gradient opacity-5" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" /> */}
      
      {location.pathname !== '/dashboard' && (
        <div className="w-full z-20 sticky top-0">
          <div className="max-w-5xl backdrop-blur-md shadow-sm bg-background/70 mx-auto border rounded-2xl mt-4">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        </div>
      )}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}