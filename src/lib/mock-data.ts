export type Project = {
  id: string;
  name: string;
  description: string;
  duration: string;
  status: 'poc-inprogress' | 'poc-completed' | 'project-inprogress' | 'project-completed';
  services: string[];
  cost: string;
  pocCost: string;
  postPocCost: string;
};

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Paint",
    description: "Digital Paint Solution for modern enterprises",
    duration: "6 months",
    status: "poc-inprogress",
    services: ["Build a custom LLM", "Create an AI App"],
    cost: "$50,000",
    pocCost: "$10,000",
    postPocCost: "$40,000"
  },
  {
    id: "2",
    name: "CRM Plus",
    description: "Customer relationship management system",
    duration: "3 months",
    status: "poc-completed",
    services: ["Build an agent", "Take a readymade agent"],
    cost: "$30,000",
    pocCost: "$8,000",
    postPocCost: "$22,000"
  },
  {
    id: "3",
    name: "TaskFlow",
    description: "Project management and collaboration tool",
    duration: "12 months",
    status: "project-inprogress",
    services: ["Create an AI App"],
    cost: "$75,000",
    pocCost: "$15,000",
    postPocCost: "$60,000"
  },
]; 