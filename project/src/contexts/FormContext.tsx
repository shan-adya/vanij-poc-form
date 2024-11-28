import { createContext, useContext, ReactNode, useState } from 'react';
import { DetailsFormValues } from '@/lib/validations';

interface FormContextType {
  formDetails: DetailsFormValues | null;
  setFormDetails: (details: DetailsFormValues) => void;
  clearFormDetails: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formDetails, setFormDetails] = useState<DetailsFormValues | null>(null);

  const clearFormDetails = () => {
    setFormDetails(null);
  };

  return (
    <FormContext.Provider value={{ formDetails, setFormDetails, clearFormDetails }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
} 