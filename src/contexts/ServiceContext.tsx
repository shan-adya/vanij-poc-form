import { createContext, useContext, useState, ReactNode } from 'react';
import { Service, UserDetails } from '@/types';

interface ServiceContextType {
  selectedServices: Service[];
  userDetails: UserDetails | null;
  setSelectedServices: (services: Service[]) => void;
  setUserDetails: (details: UserDetails) => void;
  totalPrice: number;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);

  return (
    <ServiceContext.Provider
      value={{
        selectedServices,
        userDetails,
        setSelectedServices,
        setUserDetails,
        totalPrice,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}