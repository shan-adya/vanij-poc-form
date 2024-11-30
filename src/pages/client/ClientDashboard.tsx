import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { projectsApi } from "@/lib/api/projects";
import { useAuth } from "@/contexts/AuthContext";
import { ProjectCard } from "@/components/ProjectCard";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProject = async () => {
      if (!user?.project_id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await projectsApi.getById(user.project_id);
        console.log("Response:", response);
        if (response.meta.status) {
          // Put the single project in an array
          setProjects([response.data]);
        } else {
          throw new Error(response.meta.message);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error("Failed to load your project");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProject();
  }, [user?.project_id]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Project</h2>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1].map((n) => (
            <div key={n} className="h-[300px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              isClientView={true} // Add this prop to disable edit/delete actions
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-10">
          No project assigned yet.
        </div>
      )}
    </div>
  );
} 