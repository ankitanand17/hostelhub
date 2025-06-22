// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import api from '../services/api';

// ... (interface and createContext are fine) ...
interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
    staffProfileExists: boolean;
    checkStaffProfile: () => Promise<void>;
}
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [staffProfileExists, setStaffProfileExists] = useState(false);

  const checkStaffProfile = useCallback(async () => {
    if(!user || (user.role !== 'WARDEN' && user.role !== 'CARETAKER')){
      setStaffProfileExists(false);
      return;
    }
    try{
      await api.get('/staff/profile');
      setStaffProfileExists(true);
    }catch(error){
        setStaffProfileExists(false);
    }
  },[user]);

  useEffect(() => {
    if(!isLoading && user){
      checkStaffProfile();
    }
  },[user,isLoading, checkStaffProfile]);

  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
          const parsedUser: User = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);


  const login = useCallback((userData: User, userToken: string) => {
    localStorage.setItem('authToken', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  },[]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setStaffProfileExists(false);
  },[]);

  //Memoize the context value
  const value = useMemo(() => ({ user, token, login, logout, isLoading, staffProfileExists, checkStaffProfile}),
    [user, token, isLoading, staffProfileExists, checkStaffProfile] // The dependency array
  );

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
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