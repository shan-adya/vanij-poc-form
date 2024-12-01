import { Bot, Brain, Cpu, Rocket } from 'lucide-react';

export const SERVICES = [
  {
    id: 'custom-llm',
    name: 'Build Custom LLM',
    description: 'Create a custom Large Language Model tailored to your specific needs',
    price: 5000,
    icon: Bot,
  },
  {
    id: 'build-agent',
    name: 'Build Agent',
    description: 'Develop an intelligent agent to automate your business processes',
    price: 3000,
    icon: Brain,
  },
  {
    id: 'readymade-agent',
    name: 'Take Readymade Agent',
    description: 'Get started quickly with our pre-built agent solutions',
    price: 1500,
    icon: Cpu,
  },
  {
    id: 'ai-app',
    name: 'Create AI App',
    description: 'Build a custom AI-powered application for your business',
    price: 7500,
    icon: Rocket,
  },
];

export const MOCK_REQUESTS = [
  {
    id: 'REQ-20241128-001',
    services: ['build-agent'],
    status: 'in-progress',
    pricing: 3000,
    lastUpdated: new Date('2024-11-28'),
  },
  {
    id: 'REQ-20241130-002',
    services: ['ai-app'],
    status: 'cancelled',
    pricing: 7500,
    lastUpdated: new Date('2024-11-30'),
  },
  {
    id: 'REQ-20241201-003',
    services: ['custom-llm', 'readymade-agent'],
    status: 'pending',
    pricing: 6500,
    lastUpdated: new Date('2024-12-01'),
  },
];

export const ROUTES = {
  HOME: '/vanij-poc',
  SERVICES: '/vanij-poc/services',
  DETAILS: '/vanij-poc/details',
  SUMMARY: '/vanij-poc/summary',
  DASHBOARD: '/vanij-poc/dashboard',
};