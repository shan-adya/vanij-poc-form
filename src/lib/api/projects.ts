import { api } from './config';
import { Project, ProjectsResponse } from '@/types/project';

interface ProjectDetailResponse {
  meta: {
    status: boolean;
    message: string;
  };
  data: Project & {
    _id: number;
    created_at: string;
    updated_at: string;
  };
}

export const projectsApi = {
  // Get all projects
  getAll: async () => {
    const response = await api.get<ProjectsResponse>('/project');
    return response.data;
  },

  // Get single project
  getById: async (id: string | number) => {
    const response = await api.get<ProjectDetailResponse>(`/project/get/${id}`);
    return response.data;
  },

  // Create new project
  create: async (data: CreateProjectDTO) => {
    const response = await api.post<Project>('/project/create', data);
    return response.data;
  },

  // Update project
  update: async (id: string | number, data: Partial<Project>) => {
    const response = await api.post<ProjectDetailResponse>(`/project/update/${id}`, {
      data: {
        ...data,
        // Maintain the same structure as the get response
        project_name: data.project_name,
        project_description: data.project_description,
        status: data.status,
        services: data.services,
        tasks: data.tasks,
      }
    });
    return response.data;
  },

  // Update project status
  updateStatus: async (id: string, status: string) => {
    const response = await api.patch<Project>(`/projects/${id}/status`, { status });
    return response.data;
  },

  // Delete project
  delete: async (id: string) => {
    await api.delete(`/projects/${id}`);
  },

  updateServiceStatus: async (projectId: string | number, serviceIndex: number, status: string) => {
    const response = await api.post<ProjectDetailResponse>(`/project/update/${projectId}`, {
      data: {
        services: [
          {
            index: serviceIndex,
            status: status
          }
        ]
      }
    });
    return response.data;
  },
}; 