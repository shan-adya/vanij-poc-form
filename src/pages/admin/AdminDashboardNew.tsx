import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectCard } from "@/components/ProjectCard";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api/projects";
import { Project } from "@/types/project";
import { toast } from "sonner";

export default function AdminDashboardNew() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsApi.getAll();
        setProjects(response.data);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Projects</h2>
        <Button 
          onClick={() => navigate("/admin/projects/new")}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[300px] bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
} 