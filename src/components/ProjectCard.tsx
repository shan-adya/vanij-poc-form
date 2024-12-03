import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusConfig } from '@/lib/utils/status';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, PenSquare, Copy, CopyPlus } from 'lucide-react';
import { toast } from 'sonner';
import { projectsApi } from '@/lib/api/projects';

interface ProjectCardProps {
  project: Project;
  isClientView?: boolean;
}

export function ProjectCard({ project, isClientView }: ProjectCardProps) {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(project.status);

  // Default to empty array if services is null
  const services = project.services || [];

  const handleClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the dropdown menu
    if ((e.target as HTMLElement).closest('.dropdown-trigger')) {
      return;
    }
    
    if (isClientView) {
      navigate(`/vanij-poc/client/projects/${project.id}`);
    } else {
      navigate(`/vanij-poc/admin/projects/${project.id}`);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const hostname = window.location.origin;
    const link = `${hostname}/vanij-poc?projectId=${project.id}`;
    
    navigator.clipboard.writeText(link)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/vanij-poc/admin/projects/${project.id}/edit`);
  };

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const cloneData = {
        project_name: `${project.project_name} (Clone)`,
        project_description: project.project_description,
        status: 'active',
        services: project.services,
        tasks: project.tasks,
      };
      
      // Assuming you have access to projectsApi here
      const response = await projectsApi.create(cloneData);
      toast.success("Project cloned successfully");
      navigate(`/vanij-poc/admin/projects/${response.data.id}`);
    } catch (error) {
      toast.error("Failed to clone project");
    }
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold truncate max-w-60" title={project.project_name}>
              {project.project_name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2" title={project.project_description}>
              {project.project_description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusConfig.className}>
              {statusConfig.label}
            </Badge>
            {!isClientView && (
              <DropdownMenu>
                <DropdownMenuTrigger className="dropdown-trigger" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <PenSquare className="h-4 w-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClone}>
                    <CopyPlus className="h-4 w-4 mr-2" />
                    Clone Project
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Services ({services.length})</p>
          <div className="grid gap-2">
            {services.slice(0, 2).map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-sm truncate" title={service.service_name}>
                  {service.service_name}
                </span>
                <Badge variant="outline" className={getStatusConfig(service.status).className}>
                  {service.others.estimated_timeline}
                </Badge>
              </div>
            ))}
            {services.length > 2 && (
              <p className="text-sm text-muted-foreground text-right">
                +{services.length - 2} more services
              </p>
            )}
          </div>
        </div>

        {project.tasks && project.tasks.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Latest Task: {project.tasks[0].task_name} - 
              <span className={getStatusConfig(project.tasks[0].status).className + " px-2 py-0.5 rounded text-xs"}>
                {getStatusConfig(project.tasks[0].status).label}
              </span>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 