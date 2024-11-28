import { LucideIcon } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: LucideIcon;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  useCase: string;
}

export interface Request {
  id: string;
  services: string[];
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'cancelled';
  pricing: number;
  lastUpdated: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}