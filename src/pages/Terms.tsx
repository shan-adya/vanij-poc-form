import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useService } from '@/contexts/ServiceContext';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { flowUtils } from '@/lib/utils/flowState';

const TERMS = [
  {
    id: 'cloud-charges',
    label: 'Minimal charges for cloud usage and storage during the testing period.'
  },
  {
    id: 'third-party',
    label: 'All third-party charges (e.g., LLM API, email, VoIP) will be paid by the client at actuals.'
  },
  {
    id: 'poc',
    label: 'No build charges during the POC phase. Charges apply for production deployment.'
  },
  {
    id: 'data-format',
    label: 'Client must provide data and workflows in the required format.'
  }
];

export default function Terms() {
  const navigate = useNavigate();
  const { 
    selectedServices,
    projectData,
    projectId,
    userDetails
  } = useService();
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);

  const handleTermToggle = (termId: string) => {
    setAcceptedTerms(current =>
      current.includes(termId)
        ? current.filter(id => id !== termId)
        : [...current, termId]
    );
  };

  const allTermsAccepted = acceptedTerms.length === TERMS.length;

  const handleNext = () => {
    if (allTermsAccepted) {
      navigate('/vanij-poc/summary');
    }
  };

  const totalEstimate = selectedServices.reduce((sum, service) => sum + service.price, 0);

  useEffect(() => {
    const canAccessPage = flowUtils.canAccess('terms', {
      projectData,
      projectId,
      projectTermsAccepted: true,
      userDetails,
    });

    if (!canAccessPage) {
      const redirectPath = flowUtils.getRedirectPath('terms', {
        projectData,
        projectId,
        projectTermsAccepted: true,
        userDetails,
      });
      navigate(redirectPath);
    }
  }, [projectData, projectId, userDetails, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Terms & Conditions
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          Please review and accept our terms before proceeding
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        {/* Pricing Preview */}
        {/* <div className="p-6 glass rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Pricing Preview</h3>
          <div className="space-y-2">
            {selectedServices.map(service => (
              <div key={service.id} className="flex justify-between">
                <span>{service.name}</span>
                <span className="font-semibold">${service.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between font-bold">
                <span>Estimated Total</span>
                <span className="text-primary">${totalEstimate.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                *Final costs may vary based on requirements and usage
              </p>
            </div>
          </div>
        </div> */}

        {/* Terms Checkboxes */}
        <div className="space-y-4">
          {TERMS.map((term) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-3 p-4 rounded-lg bg-background/50 border cursor-pointer"
              onClick={() => handleTermToggle(term.id)}
            >
              <Checkbox
                id={term.id}
                checked={acceptedTerms.includes(term.id)}
                // onCheckedChange={() => handleTermToggle(term.id)}
              />
              <div
                className="text-sm leading-none cursor-pointer"
              >
                {term.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between mt-8"
        >
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/details")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Details
          </Button>
          <Button
            onClick={handleNext}
            disabled={!allTermsAccepted}
            className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
          >
            Continue to Summary
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
} 