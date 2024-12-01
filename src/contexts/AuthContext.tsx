import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';
import { userApi } from '@/lib/api/user';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: string;
  project_id: number;
}

interface DecodedToken {
  id: number;
  exp: number;
  // add other token fields if needed
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (userId: string, otp: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add this constant at the top of the file
const STORAGE_PREFIX = 'vanij-poc';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(`${STORAGE_PREFIX}-token`);

      if (token) {
        try {
          // Decode token
          const decoded = jwtDecode<DecodedToken>(token);
          
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expired');
          }

          // Get user data using ID from token
          const response = await userApi.getById(decoded.id);
          
          if (response.data.meta.status) {
            setUser(response.data.data);
          } else {
            throw new Error(response.data.meta.message);
          }
        } catch (error) {
          console.error('Error restoring session:', error);
          localStorage.clear();
          toast.error('Session expired. Please login again.');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData: User): Promise<void> => {
    setUser(userData);
    // Only store token, no need to store userId
    // localStorage.setItem('token', token); // Set this when receiving token from API
  };

  const logout = async () => {
    setUser(null);
    localStorage.clear();
  };

  const verifyOTP = async (userId: string, otp: string) => {
    try {
      const response = await authApi.verifyOTP(userId, otp);
      if (!response.meta.status) {
        throw new Error(response.meta.message || 'OTP verification failed');
      }
      return response;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}