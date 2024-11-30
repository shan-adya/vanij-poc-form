import { Project } from '@/types/project';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getStatusConfig } from '@/lib/utils/status';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu } from '@/components/ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  isClientView?: boolean;
}

export function ProjectCard({ project, isClientView }: ProjectCardProps) {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(project.status);

  // Default to empty array if services is null
  const services = project.services || [];

  const handleClick = () => {
    if (isClientView) {
      navigate(`/client/projects/${project.id}`);
    } else {
      navigate(`/admin/projects/${project.id}`);
    }
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{project.project_name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {project.project_description}
            </p>
          </div>
          <Badge className={statusConfig.className}>
            {statusConfig.label}
          </Badge>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Services ({services.length})</p>
          <div className="grid gap-2">
            {services.slice(0, 2).map((service, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{service.service_name}</span>
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