import { api } from './config';

export const userApi = {
  getById: (id: number) => api.get(`/user/get/${id}`),
  create: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    mobile_number: string;
    project_id: number;
    roles: string;
  }) => api.post('/user/create', userData),
}; 