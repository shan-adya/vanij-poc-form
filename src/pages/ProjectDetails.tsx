import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useService } from '@/contexts/ServiceContext';
import { projectsApi } from '@/lib/api/projects';
import { userApi } from '@/lib/api/user';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Users, DollarSign, Mail, Phone, User, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { getStatusConfig } from '@/lib/utils/status';
import { cn } from '@/lib/utils';
import ProjectTermsModal from "@/components/ProjectTermsModal";
import { flowUtils } from '@/lib/utils/flowState';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminUser {
  first_name: string;
  last_name: string;
  mobile_number: string;
  email: string;
}

interface UserResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: AdminUser & {
    created_at: string;
    updated_at: string;
    id: number;
    dob: string;
    otp: string;
  };
}

export default function ProjectDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    setProjectData, 
    setProjectId,
    projectData,
    projectId
  } = useService();
  const [isLoading, setIsLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [showAdminContact, setShowAdminContact] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const canAccessPage = flowUtils.canAccess('project-details', {
      projectData,
      projectId,
      projectTermsAccepted: termsAccepted
    });

    if (!canAccessPage) {
      const redirectPath = flowUtils.getRedirectPath('project-details', {
        projectData,
        projectId,
        projectTermsAccepted: termsAccepted
      });
      navigate(redirectPath);
    }
  }, [projectData, projectId, termsAccepted, navigate]);

  useEffect(() => {
    const fetchProject = async (id: string) => {
      setIsLoading(true);
      try {
        const response = await projectsApi.getById(id);
        const project = response.data;
        
        if (!project) {
          toast.error("Project not found");
          return;
        }

        if (project.user_id || project.user_details) {
          setProjectData(null);
          setProjectId(null);
          return;
        }

        setProjectData(project);
        setProjectId(id);
        
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error("Failed to load project details");
        setProjectData(null);
        setProjectId(null);
      } finally {
        setIsLoading(false);
      }
    };

    const urlProjectId = searchParams.get('projectId');
    
    // If there's a projectId in the URL, use that
    if (urlProjectId) {
      fetchProject(urlProjectId);
    } 
    // If there's a stored projectId but no URL parameter, use the stored one
    else if (projectId) {
      fetchProject(projectId);
    } 
    // If neither exists, redirect to service selection
    else {
      navigate('/vanij-poc/services');
    }
  }, [searchParams, setProjectData, setProjectId, projectId, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      setIsLoadingAdmin(true);
      try {
        const response = await userApi.getById(1); // Admin ID is 1
        const userData: UserResponse = response.data;
        
        if (userData.meta.status && userData.data) {
          setAdminData({
            first_name: userData.data.first_name,
            last_name: userData.data.last_name,
            mobile_number: userData.data.mobile_number,
            email: userData.data.email
          });
        } else {
          throw new Error(userData.meta.message);
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error("Failed to load admin contact information");
      } finally {
        setIsLoadingAdmin(false);
      }
    };

    fetchAdminData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              Project Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              This project is already assigned to another user. Please contact our admin to get your own personalized project.
            </p>

            {/* Admin Contact Section */}
            {isLoadingAdmin ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : adminData ? (
              <div className="space-y-4 border rounded-lg p-6 bg-muted/10">
                <h3 className="font-semibold text-center">Contact Admin</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-2 justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {adminData.first_name} {adminData.last_name}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2 justify-center">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${adminData.mobile_number}`}
                      className="text-primary hover:underline"
                    >
                      {adminData.mobile_number}
                    </a>
                  </div> */}
                  <div className="flex items-center gap-2 justify-center">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${adminData.email}`}
                      className="text-primary hover:underline"
                    >
                      {adminData.email}
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                Admin contact information is currently unavailable
              </p>
            )}

            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/vanij-poc')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (termsAccepted) {
      navigate('/vanij-poc/details');
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (termsAccepted) {
      return;
    }
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handleTermsAccept = () => {
    setTermsAccepted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Project Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">{projectData.project_name}</h1>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <pre className="text-muted-foreground mt-2 whitespace-pre-wrap text-start">{projectData.project_description}</pre>
          </ScrollArea>
        </div>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle>Requested Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projectData.services.map((service, index) => (
              <div 
                key={index}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className='flex flex-col gap-2'>
                  <h3 className="font-semibold truncate" title={service.service_name}>
                    {service.service_name}
                  </h3>
                  <div className="relative">
                    <div className={cn(
                      "text-sm text-muted-foreground",
                      !expandedDescriptions[index] && "line-clamp-2"
                    )}>
                      <pre className="whitespace-pre-wrap">{service.service_description}</pre>
                    </div>
                    {service.service_description.length > 100 && (
                      <button
                        onClick={() => setExpandedDescriptions(prev => ({
                          ...prev,
                          [index]: !prev[index]
                        }))}
                        className="text-xs text-primary hover:text-primary/80 mt-1"
                      >
                        {expandedDescriptions[index] ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
                    <span className="text-sm" title={service.others.poc_timeline}>
                      POC Timeline: {service.others.poc_timeline}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <span className="text-sm" title={`POC Cost: ${service.poc_cost}`}>
                      POC Cost: {service.poc_cost}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {/* <Clock className="h-4 w-4 text-muted-foreground" /> */}
                    <span className="text-sm" title={service.others.estimated_timeline}>
                      Final Timeline: {service.others.estimated_timeline}
                    </span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate" title={`Team Size: ${service.others.team_size} members`}>
                      Team Size: {service.others.team_size} members
                    </span>
                  </div> */}
                  <div className="flex items-center gap-2 col-span-2">
                    {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
                    <span className="text-sm" title={`Cost: ${service.cost}`}>
                      Cost: {service.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admin Contact Info - Updated version */}
        <Card>
          <CardContent className="pt-6">
            <button
              onClick={() => setShowAdminContact(!showAdminContact)}
              className="w-full flex items-center justify-between text-primary hover:text-primary/80 transition-colors"
            >
              <span className="text-sm font-medium">
                Want to request changes in the project?
              </span>
              {showAdminContact ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdminContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t"
              >
                {isLoadingAdmin ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                  </div>
                ) : adminData ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Contact our admin for any modifications or queries:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {adminData.first_name} {adminData.last_name}
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`tel:${adminData.mobile_number}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {adminData.mobile_number}
                        </a>
                      </div> */}
                      <div className="flex items-center gap-2 md:col-span-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={`mailto:${adminData.email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {adminData.email}
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Admin contact information is currently unavailable
                  </p>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Terms Acceptance */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onClick={handleCheckboxClick}
                  onCheckedChange={(checked) => {
                    if (!checked) {
                      setTermsAccepted(false);
                    }
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground cursor-pointer"
                  onClick={handleCheckboxClick}
                >
                  I understand and accept the project requirements
                </label>
              </div>

              <Button
                onClick={handleNext}
                disabled={!termsAccepted}
                className="gradient-hover bg-gradient-to-r from-primary to-secondary text-white"
              >
                Continue to Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <ProjectTermsModal
        open={showTermsModal}
        onOpenChange={setShowTermsModal}
        onAccept={handleTermsAccept}
      />
    </div>
  );
} 