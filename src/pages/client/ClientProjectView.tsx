import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/lib/utils/status";
import { Project } from "@/types/project";
import { projectsApi } from "@/lib/api/projects";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
              Last updated: {format(new Date(project.updated_at), 'MMM dd, yyyy HH:mm')}
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
                      ${service.cost.toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">POC Cost: </span>
                      ${service.poc_cost.toLocaleString()}
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
              <div key={task.task_id} className="flex items-center justify-between">
                <span>{task.task_name}</span>
                <Badge className={getStatusConfig(task.status).className}>
                  {getStatusConfig(task.status).label}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
} 