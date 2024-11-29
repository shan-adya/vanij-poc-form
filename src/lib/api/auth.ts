import { api } from './config';

export interface LoginResponse {
  message: string;
  email: string;
  id: string;
}

export interface VerifyOTPResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  // Request OTP
  login: async (email: string) => {
    const response = await api.post<LoginResponse>('/user/login', { login: email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (id: string, otp: string) => {
    const response = await api.post<VerifyOTPResponse>('/user/verify_otp', {
      id,
      otp,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },

  // Resend OTP
  resendOTP: async (email: string) => {
    const response = await api.post<LoginResponse>('/auth/resend-otp', { email });
    return response.data;
  },
}; 