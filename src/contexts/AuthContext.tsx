import { createContext, useContext, useState, useEffect } from 'react';
import { authApi, VerifyOTPResponse, LoginResponse } from '@/lib/api/auth';
import { handleApiError } from '@/lib/api/error-handling';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  mobile_number: string;
  roles: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<LoginResponse>;
  verifyOTP: (id: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string) => {
    try {
      const response = await authApi.login(email);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const verifyOTP = async (id: string, otp: string) => {
    try {
      const response = await authApi.verifyOTP(id, otp);
      setUser(response.data);
      navigate('/admin');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      handleApiError(error);
    }
  };

  const resendOTP = async (email: string) => {
    try {
      await authApi.resendOTP(email);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        login, 
        verifyOTP, 
        logout,
        resendOTP 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};