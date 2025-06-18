// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

// ... (interface and createContext are fine) ...
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, userToken: string) => {
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // 2. Memoize the context value
  // This value object will now only be recreated if user or token changes.
  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isLoading,
    }),
    [user, token, isLoading] // The dependency array
  );

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// ... (useAuth hook is fine) ...
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};