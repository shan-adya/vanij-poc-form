import { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { Service } from '@/types';

interface UserDetails {
  name: string;
  email: string;
  company: string;
  requirements?: string;
}

interface ServiceContextType {
  selectedServices: Service[];
  setSelectedServices: (services: Service[]) => void;
  userDetails: UserDetails | null;
  setUserDetails: (details: UserDetails | null) => void;
  projectData: Project | null;
  setProjectData: (project: Project | null) => void;
  projectId: string | null;
  setProjectId: (id: string | null) => void;
  clearProjectData: () => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [projectData, setProjectData] = useState<Project | null>(() => {
    const saved = localStorage.getItem('projectData');
    return saved ? JSON.parse(saved) : null;
  });
  const [projectId, setProjectId] = useState<string | null>(() => {
    return localStorage.getItem('projectId');
  });

  // Persist projectData and projectId to localStorage
  useEffect(() => {
    if (projectData) {
      localStorage.setItem('projectData', JSON.stringify(projectData));
    } else {
      localStorage.removeItem('projectData');
    }
  }, [projectData]);

  useEffect(() => {
    if (projectId) {
      localStorage.setItem('projectId', projectId);
    } else {
      localStorage.removeItem('projectId');
    }
  }, [projectId]);

  const clearProjectData = () => {
    setProjectData(null);
    setProjectId(null);
    localStorage.removeItem('projectData');
    localStorage.removeItem('projectId');
  };

  return (
    <ServiceContext.Provider value={{
      selectedServices,
      setSelectedServices,
      userDetails,
      setUserDetails,
      projectData,
      setProjectData,
      projectId,
      setProjectId,
      clearProjectData,
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}