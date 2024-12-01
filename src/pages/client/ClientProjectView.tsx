import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatusConfig } from "@/lib/utils/status";
import { Project } from "@/types/project";
import { projectsApi } from "@/lib/api/projects";
import { toast } from "sonner";
import { formatDate } from '@/lib/utils/date';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

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

  const handleTaskStatusUpdate = async (taskIndex: number, newStatus: string) => {
    if (!project || !id) return;
    
    setIsUpdatingTask(true);
    try {
      // Create updated tasks array with new status
      const updatedTasks = project.tasks.map((task, index) => {
        if (index === taskIndex) {
          return {
            ...task,
            status: newStatus
          };
        }
        // Return original task without modification
        return task;
      });

      // Only send the tasks array in the update
      const response = await projectsApi.update(id, {
        ...project,
        tasks: updatedTasks
      });

      setProject(response.data);
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error("Failed to update task status");
    } finally {
      setIsUpdatingTask(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/client")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-semibold">{project.project_name}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {project.project_description}
            </p>
            <div className="text-sm text-muted-foreground mt-2">
              Last updated: {formatDate(project.updated_at)}
            </div>
            <Badge className={cn("mt-4", getStatusConfig(project.status).className)}>
              {getStatusConfig(project.status).label}
            </Badge>
          </div>
        </div>
      </Card>

      {project.services && project.services.length > 0 && (
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Services</h3>
          <div className="space-y-4">
            {project.services.map((service, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div>
                      <p className="font-medium">{service.service_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {service.service_description}
                      </p>
                      <Badge className={cn("mt-2", getStatusConfig(service.status).className)}>
                        {getStatusConfig(service.status).label}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Timeline: </span>
                      {service.others.estimated_timeline}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Team Size: </span>
                      {service.others.team_size} members
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Total Cost: </span>
                      {service.cost.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">POC Cost: </span>
                      {service.poc_cost.toLocaleString()}
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
            {project.tasks.map((task, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between p-4 rounded-lg border"
              >
                <span className="text-sm whitespace-pre-wrap break-all pr-4">{task.task_name}</span>
                {task.task_name !== "Fill up user details" && 
                 task.task_name !== "Agree to terms" ? (
                  <Select
                    value={task.status}
                    onValueChange={(status) => handleTaskStatusUpdate(index, status)}
                    disabled={isUpdatingTask}
                  >
                    <SelectTrigger 
                      className={cn(
                        "w-[140px]",
                        getStatusConfig(task.status).className
                      )}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['pending', 'in_progress', 'completed'].map((status) => {
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
                ) : (
                  <Badge className={getStatusConfig(task.status).className}>
                    {getStatusConfig(task.status).label}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 