import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import StepIndicator from './StepIndicator';

interface LayoutProps {
  children: ReactNode;
}

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

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const steps = ['/', '/details', '/terms', '/summary'];
  const currentStep = steps.indexOf(location.pathname) + 1;

  return (
    <div className="min-h-screen bg-background flex flex-col relative py-10 overflow-x-hidden">
      <div className="absolute inset-0 animated-gradient opacity-5" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      
      {location.pathname !== '/dashboard' && (
        <div className="w-full border-b bg-background/50 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StepIndicator steps={STEPS} currentStep={currentStep} />
          </div>
        </div>
      )}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}