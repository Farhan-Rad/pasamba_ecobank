import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { DEMO_CREDENTIALS, mockUser, mockAdminUser } from '@/lib/mock-data';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  xp: number;
  level: number;
  profile?: {
    bio?: string;
    phone?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; username: string }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const FAKE_TOKEN = 'demo-jwt-token-ecobank-2025';

function loadStoredUser(): User | null {
  try {
    const stored = localStorage.getItem('ecobank-user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ecobank-token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      if (email === 'admin@ecobank.id' && password === 'password123') {
        setUser(mockAdminUser);
        setToken(FAKE_TOKEN);
        localStorage.setItem('ecobank-token', FAKE_TOKEN);
        localStorage.setItem('ecobank-user', JSON.stringify(mockAdminUser));
      } else if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        setUser(mockUser);
        setToken(FAKE_TOKEN);
        localStorage.setItem('ecobank-token', FAKE_TOKEN);
        localStorage.setItem('ecobank-user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: { email: string; password: string; name: string; username: string }) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        username: data.username,
        avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.username}`,
        role: 'USER',
        xp: 0,
        level: 1,
        profile: { bio: '', phone: '' },
      };
      setUser(newUser);
      setToken(FAKE_TOKEN);
      localStorage.setItem('ecobank-token', FAKE_TOKEN);
      localStorage.setItem('ecobank-user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecobank-token');
    localStorage.removeItem('ecobank-user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
