export type FlowStep = 'project-details' | 'details' | 'terms' | 'summary';

const FLOW_ORDER: FlowStep[] = ['project-details', 'details', 'terms', 'summary'];

export const flowUtils = {
  canAccess: (currentStep: FlowStep, requiredData: Record<string, any>): boolean => {
    const currentIndex = FLOW_ORDER.indexOf(currentStep);
    if (currentIndex === 0) return true; // ProjectDetails page is always accessible

    // Check previous steps' requirements
    switch (currentStep) {
      case 'details':
        return Boolean(
          requiredData.projectData && 
          requiredData.projectId &&
          requiredData.projectTermsAccepted
        );

      case 'terms':
        return Boolean(
          requiredData.projectData && 
          requiredData.projectId && 
          requiredData.projectTermsAccepted &&
          requiredData.userDetails
        );

      case 'summary':
        return Boolean(
          requiredData.projectData && 
          requiredData.projectId && 
          requiredData.projectTermsAccepted &&
          requiredData.userDetails && 
          requiredData.serviceTermsAccepted
        );

      default:
        return false;
    }
  },

  getRedirectPath: (currentStep: FlowStep, requiredData: Record<string, any>): string => {
    // Check step 1 requirements
    if (!requiredData.projectData || !requiredData.projectId) {
      return '/';
    }

    // Check project terms acceptance (step 1)
    if (!requiredData.projectTermsAccepted) {
      return '/';
    }
    
    // Check user details (step 2)
    if (!requiredData.userDetails) {
      return '/details';
    }
    
    // Check service terms acceptance (step 3)
    if (!requiredData.serviceTermsAccepted && currentStep === 'summary') {
      return '/terms';
    }
    
    return '/';
  }
}; 