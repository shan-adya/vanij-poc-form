import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useService } from '@/contexts/ServiceContext';
import { projectsApi } from '@/lib/api/projects';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ServiceCard from '@/components/ServiceCard';
import TermsModal from '@/components/TermsModal';
import { SERVICES } from '@/lib/constants';
import { Service } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function ServiceSelection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    setProjectData, 
    setProjectId,
    selectedServices,
    setSelectedServices 
  } = useService();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      const fetchProject = async () => {
        setIsLoading(true);
        try {
          const response = await projectsApi.getById(projectId);
          const project = response.data;
          
          if (!project) {
            toast.error("Project not found");
            return;
          }

          setProjectData(project);
          setProjectId(projectId);
          
          // Pre-select the services from the project
          if (project.services && project.services.length > 0) {
            setSelectedServices(project.services.map(service => ({
              id: service.service_name.toLowerCase().replace(/ /g, '-'),
              name: service.service_name,
              description: service.service_description,
              price: service.cost
            })));
          }
          
        } catch (error) {
          console.error('Error fetching project:', error);
          toast.error("Failed to load project details");
          setProjectData(null);
          setProjectId(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProject();
    }
  }, [searchParams, setProjectData, setProjectId, setSelectedServices]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleNext = () => {
    if (selectedServices.length > 0 && termsAccepted) {
      navigate('/vanij-poc/details');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Select Your AI Services
          </h1>
          <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Choose from our cutting-edge AI solutions to transform your business. 
          Select multiple services to create a comprehensive solution.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 "
      >
        {SERVICES.map((service) => (
          <motion.div key={service.id} variants={item}>
            <ServiceCard
              {...service}
              selected={selectedServices.some((s) => s.id === service.id)}
              onClick={() => toggleService(service)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-center p-6 glass rounded-lg"
      >
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {selectedServices.length}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Selected Services
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedServices.length === 0 
                ? "Choose at least one service to proceed" 
                : `${selectedServices.length} service${selectedServices.length > 1 ? 's' : ''} selected`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="border-primary"
            />
            <label
              htmlFor="terms"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              I accept the{" "}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-primary hover:underline focus:outline-none"
              >
                terms and conditions
              </button>
            </label>
          </div>

          <Button
            size="lg"
            onClick={handleNext}
            disabled={selectedServices.length === 0 || !termsAccepted}
            className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Pricing Disclaimer */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-sm text-muted-foreground text-center"
      >
        <p>* All prices are base estimates. Final pricing may vary based on specific requirements.</p>
        <p>* Cloud usage and third-party service charges will be calculated separately.</p>
      </motion.div> */}

      <TermsModal 
        open={showTermsModal} 
        onOpenChange={setShowTermsModal} 
      />
    </div>
  );
}