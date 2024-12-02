import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatusConfig } from "@/lib/utils/status";
import { cn } from "@/lib/utils";
import { projectsApi } from "@/lib/api/projects";
import { toast } from "sonner";
import { formatDate } from '@/lib/utils/date';
import { Button } from "@/components/ui/button";
import { PenSquare, Copy, ArrowLeft, CopyPlus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserDetails {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  company_name: string;
  designation: string;
  use_case: string;
  created_at: string;
}

interface Project {
  project_name: string;
  project_description: string;
  status: string;
  services: {
    service_name: string;
    service_description: string;
    status: string;
    cost: string;
    poc_cost: string;
    others: {
      estimated_timeline: string;
      poc_timeline: string;
    };
  }[];
  tasks: {
    task_id: string;
    task_name: string;
    status: string;
  }[];
  user_details?: UserDetails;
}

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const response = await projectsApi.getById(id);
        setProject(response.data);
      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!project || !id) return;
    
    setIsUpdating(true);
    try {
      const response = await projectsApi.update(id, {
        project_name: project.project_name,
        project_description: project.project_description,
        status: newStatus,
        services: (project.services || []).map(service => ({
          service_name: service.service_name,
          service_description: service.service_description,
          status: service.status,
          cost: service.cost,
          poc_cost: service.poc_cost,
          others: {
            estimated_timeline: service.others.estimated_timeline,
            poc_timeline: service.others.poc_timeline,
          },
        })),
        tasks: project.tasks?.map(task => ({
          task_id: task.task_id,
          task_name: task.task_name,
          status: task.status,
        })),
      });
      setProject(response.data);
      toast.success("Project status updated successfully");
    } catch (error) {
      toast.error("Failed to update project status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleServiceStatusUpdate = async (serviceIndex: number, newStatus: string) => {
    if (!project || !id || !project.services) return;
    
    setIsUpdating(true);
    try {
      const updatedServices = project.services.map((service, index) => ({
        ...service,
        status: index === serviceIndex ? newStatus : service.status,
      }));

      const response = await projectsApi.update(id, {
        project_name: project.project_name,
        project_description: project.project_description,
        status: project.status,
        services: updatedServices.map(service => ({
          service_name: service.service_name,
          service_description: service.service_description,
          status: service.status,
          cost: service.cost,
          poc_cost: service.poc_cost,
          others: {
            estimated_timeline: service.others.estimated_timeline,
            poc_timeline: service.others.poc_timeline,
          },
        })),
        tasks: project.tasks?.map(task => ({
          task_id: task.task_id,
          task_name: task.task_name,
          status: task.status,
        })),
      });
      
      setProject(response.data);
      toast.success("Service status updated successfully");
    } catch (error) {
      toast.error("Failed to update service status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    const hostname = window.location.origin;
    const link = `${hostname}/vanij-poc?projectId=${project?.id}`;
    
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  const handleCloneProject = async () => {
    if (!project || !id) return;
    
    setIsUpdating(true);
    try {
      const cloneData = {
        project_name: `${project.project_name} (Clone)`,
        project_description: project.project_description,
        status: 'active',
        services: project.services,
        tasks: project.tasks,
      };
      
      const response = await projectsApi.create(cloneData);
      toast.success("Project cloned successfully");
      navigate(`/vanij-poc/admin/projects/${response.data.id}`);
    } catch (error) {
      toast.error("Failed to clone project");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setIsUpdating(true);
    try {
      await projectsApi.delete(id);
      toast.success("Project deleted successfully");
      navigate("/vanij-poc/admin");
    } catch (error) {
      toast.error("Failed to delete project");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="space-y-4">
      <div className="h-8 bg-muted animate-pulse rounded" />
      <div className="h-[200px] bg-muted animate-pulse rounded" />
    </div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/vanij-poc/admin")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <Select
              value={project.status}
              onValueChange={handleStatusUpdate}
              disabled={isUpdating}
            >
              <SelectTrigger 
                className={cn(
                  "w-[180px]",
                  getStatusConfig(project.status).className
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['active', 'in_progress', 'completed', 'on_hold'].map((status) => {
                  const config = getStatusConfig(status);
                  return (
                    <SelectItem 
                      key={status} 
                      value={status}
                      className="py-2"
                    >
                      {config.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Card className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold" title={project.project_name}>
                  {project.project_name}
                </h3>
                <p className="text-sm text-muted-foreground" title={project.project_description}>
                  {project.project_description}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  onClick={() => navigate(`/vanij-poc/admin/projects/${project.id}/edit`)}
                  className="gap-2"
                >
                  <PenSquare className="h-4 w-4" />
                  Edit Project
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloneProject}
                  disabled={isUpdating}
                  className="gap-2"
                >
                  <CopyPlus className="h-4 w-4" />
                  Clone Project
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Share Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isUpdating}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Project
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(project.updated_at)}
              </div>
            </div>
          </Card>
        </div>

        {project.user_details && (
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Client Information</h3>
              <Badge variant="outline" className="text-primary">
                Accepted Project
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Name: </span>
                  {project.user_details.first_name} {project.user_details.last_name}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Email: </span>
                  {project.user_details.email}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Phone: </span>
                  {project.user_details.mobile_number}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Company: </span>
                  {project.user_details.company_name}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Designation: </span>
                  {project.user_details.designation}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Accepted on: </span>
                  {formatDate(project.user_details.created_at)}
                </p>
              </div>
            </div>
            {project.user_details.use_case && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Use Case:</p>
                <p className="text-sm">{project.user_details.use_case}</p>
              </div>
            )}
          </Card>
        )}

        {project.services && project.services.length > 0 && (
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Services</h3>
            <div className="space-y-4">
              {project.services.map((service, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium truncate" title={service.service_name}>
                            {service.service_name}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2" title={service.service_description}>
                            {service.service_description}
                          </p>
                        </div>
                        <Select
                          value={service.status}
                          onValueChange={(status) => handleServiceStatusUpdate(index, status)}
                          disabled={isUpdating}
                        >
                          <SelectTrigger 
                            className={cn(
                              "w-[140px]",
                              getStatusConfig(service.status).className
                            )}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['in_progress', 'planned', 'completed', 'on_hold'].map((status) => {
                              const config = getStatusConfig(status);
                              return (
                                <SelectItem 
                                  key={status} 
                                  value={status}
                                  className="py-2"
                                >
                                  {config.label}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm truncate" title={`POC Timeline: ${service.others.poc_timeline}`}>
                        <span className="text-muted-foreground">POC Timeline: </span>
                        {service.others.poc_timeline}
                      </p>
                      <p className="text-sm truncate" title={`POC Cost: ${service.poc_cost}`}>
                        <span className="text-muted-foreground">POC Cost: </span>
                        {service.poc_cost}
                      </p>
                      <p className="text-sm truncate" title={`Timeline: ${service.others.estimated_timeline}`}>
                        <span className="text-muted-foreground">Timeline: </span>
                        {service.others.estimated_timeline}
                      </p>
                      <p className="text-sm truncate" title={`Total Cost: ${service.cost}`}>
                        <span className="text-muted-foreground">Total Cost: </span>
                        {service.cost}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {project.tasks && project.tasks.length > 0 && (
          <Card className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Tasks</h3>
            <div className="space-y-4">
              {project.tasks.map((task) => (
                <div 
                  key={task.task_id} 
                  className="flex items-start justify-between p-4 rounded-lg border"
                >
                  <span className="text-sm whitespace-pre-wrap break-all pr-4">{task.task_name}</span>
                  <Badge className={getStatusConfig(task.status).className}>
                    {getStatusConfig(task.status).label}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 