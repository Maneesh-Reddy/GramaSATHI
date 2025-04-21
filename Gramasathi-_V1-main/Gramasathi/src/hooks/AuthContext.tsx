import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useApi from './useApi';

interface User {
  id: string;
  name: string;
  email: string;
  preferredLanguage: string;
  role: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean, error?: string}>;
  register: (userData: any) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const api = useApi();
  
  const isAuthenticated = !!user && !!token;
  
  // Load user data on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          setIsLoading(true);
          const response = await api.request('/auth/me');
          
          if (response.success) {
            setUser(response.data.user);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await api.request('/auth/login', {
        method: 'POST',
        body: { email, password }
      });
      
      if (response.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };
  
  // Register function
  const register = async (userData: any) => {
    try {
      const response = await api.request('/auth/register', {
        method: 'POST',
        body: userData
      });
      
      if (response.success) {
        const { token: newToken, user: newUser } = response.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(newUser);
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };
  
  // Update user
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 