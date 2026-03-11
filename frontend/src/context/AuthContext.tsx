import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type User = { id: number; username: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  register: (username: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me/', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setUser(data.id ? data : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function getCsrf(): Promise<string> {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    if (match) return match[1];
    await fetch('/api/auth/me/', { credentials: 'include' });
    const match2 = document.cookie.match(/csrftoken=([^;]+)/);
    return match2 ? match2[1] : '';
  }

  async function login(username: string, password: string): Promise<string | null> {
    const csrf = await getCsrf();
    const res = await fetch('/api/auth/login/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? 'Erro ao fazer login.';
    setUser(data);
    return null;
  }

  async function register(username: string, password: string): Promise<string | null> {
    const csrf = await getCsrf();
    const res = await fetch('/api/auth/register/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? 'Erro ao cadastrar.';
    setUser(data);
    return null;
  }

  async function logout(): Promise<void> {
    const csrf = await getCsrf();
    await fetch('/api/auth/logout/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRFToken': csrf },
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
