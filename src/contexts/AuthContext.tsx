
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/user';
import { toast } from 'sonner';

interface AuthContextType {
  authState: AuthState;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true
  });
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setAuthState({
          user: JSON.parse(storedUser),
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('currentUser');
        setAuthState({ user: null, isLoading: false });
      }
    } else {
      setAuthState({ user: null, isLoading: false });
    }
  }, []);
  
  const login = (email: string) => {
    // Simple login that just creates a user with the email
    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      email,
      createdAt: now
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthState({ user, isLoading: false });
    toast.success('Successfully logged in!');
  };
  
  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({ user: null, isLoading: false });
    toast.success('Successfully logged out');
  };
  
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
