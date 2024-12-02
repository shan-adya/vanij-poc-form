export interface Project {
  id: number;
  project_name: string;
  project_description: string;
  status: string;
  services: Array<{
    service_name: string;
    service_description: string;
    cost: number;
    poc_cost: number;
    status: string;
    others: {
      estimated_timeline: string;
      poc_timeline: string;
    };
  }>;
  tasks?: Array<{
    task_id: number;
    task_name: string;
    status: string;
  }>;
}

export interface ProjectsResponse {
  meta: {
    status: boolean;
    message: string;
    pagination: {
      per_page: number;
      page_no: number;
      total_rows: number;
      total_pages: number;
    };
  };
  data: Project[];
} 