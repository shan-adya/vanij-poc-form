import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useService } from '@/contexts/ServiceContext';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeft, Clock, Users, DollarSign, Loader2 } from 'lucide-react';
import { getStatusConfig } from '@/lib/utils/status';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import UserDetailsSummary from '@/components/UserDetailsSummary';
import { userApi } from '@/lib/api/user';
import { projectsApi } from '@/lib/api/projects';
import { flowUtils } from '@/lib/utils/flowState';

export default function Summary() {
  const navigate = useNavigate();
  const { 
    userDetails, 
    projectId,
    projectData,
    clearProjectData
  } = useService();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  // Add useEffect to check for required data
  useEffect(() => {
    const canAccessPage = flowUtils.canAccess('summary', {
      projectData,
      projectId,
      projectTermsAccepted: true,
      userDetails,
      serviceTermsAccepted: true
    });

    if (!canAccessPage) {
      const redirectPath = flowUtils.getRedirectPath('summary', {
        projectData,
        projectId,
        projectTermsAccepted: true,
        userDetails,
        serviceTermsAccepted: true
      });
      navigate(redirectPath);
    }
  }, [projectData, projectId, userDetails, navigate]);

  const handleSubmit = async () => {
    if (!userDetails || !projectId) {
      toast.error("Required information is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Create user first and get the user ID

      toast.promise(
        userApi.create({
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
            email: userDetails.email,
            mobile_number: userDetails.phone,
            project_id: Number(projectId),
            role: "USER",
            company_name: userDetails.company,
            designation: userDetails.designation,
            use_case: userDetails.useCase
          }), {
        id: 'user-creation',
        loading: 'Creating your account...',
        success: (data) => {
            setUserId(data.data.data.id);
            console.log(data.data.data.id);

            // 2. Update project tasks with user_id
            if (!projectData) {
                throw new Error("Project data is missing");
              }
        
              const updatedTasks = projectData.tasks.map(task => {
                if (
                  task.task_name === "Fill up user details" || 
                  task.task_name === "Agree to terms"
                ) {
                  return {
                    ...task,
                    status: "completed"
                  };
                }
                return task;
              });
        
              toast.promise(
                projectsApi.update(projectId, {
                  ...projectData,
                  tasks: updatedTasks,
                  user_id: data.data.data.id // Add the user ID to the project update
                }), {
                  id: 'project-update',
                  loading: 'Updating project status...',
                  success: (response) => {
                    if (!response?.meta?.status) {
                      throw new Error(response?.meta?.message || 'Failed to update project status');
                    }
                    return 'Project status updated!';
                  },
                  error: (error) => {
                    const errorMessage = error?.response?.meta?.message 
                      || error?.message 
                      || 'Failed to update project status';
                    throw new Error(errorMessage);
                  }
                }
              );

            return 'Account created successfully!';
        },
        error: (error) => {
          const errorMessage = error?.response?.data?.meta?.message 
            || error?.message 
            || 'Failed to create account';
          throw new Error(errorMessage);
        }
      });

    //   console.log("userResponse", createUserPromise);
      // Get the user ID from the response
    //   const userId = createUserPromise.data.data.id;

      

      // 3. Clear project data and navigate to login
      clearProjectData();
      navigate('/vanij-poc/login');

    } catch (error) {
      console.error('Error during submission:', error);
      toast.error(error.message || 'Registration process failed', {
        id: 'submission-error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Review Your Request</h1>
      
      <div className="space-y-8">
        {/* Project Details */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">{projectData?.project_name}</h1>
          <p className="text-muted-foreground mt-2">{projectData?.project_description}</p>
        </div>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Requested Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectData?.services.map((service, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-4"
              >
                <div>
                  <h3 className="font-semibold">{service.service_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.service_description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Timeline: {service.others.estimated_timeline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Team Size: {service.others.team_size} members
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Cost: {service.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* User Details */}
        <UserDetailsSummary details={userDetails} />
        
        {/* Submit Section */}
        <Card>
          <CardHeader>
            <CardTitle>Ready to Submit?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Please review all the information above carefully. Once submitted, our team will review your request and get back to you within 24-48 hours.
            </p>
            <div className="flex justify-between items-center">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/vanij-poc/details')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> 
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}