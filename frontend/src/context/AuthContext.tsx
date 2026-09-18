import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, LoginInput, RegisterInput, User } from "@/types";
import { api, getSession } from "@/services/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  isMember: boolean;
  isCoopAdmin: boolean;
  isPlatformAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session.user);
      setToken(session.token);
      api.auth
        .me(session.token)
        .then((fresh) => {
          if (fresh) setUser(fresh);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const res: AuthResponse = await api.auth.login(input);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const res: AuthResponse = await api.auth.register(input);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    api.auth.logout();
    setUser(null);
    setToken(null);
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      const session = getSession();
      if (session) {
        localStorage.setItem(
          "herway.session.v1",
          JSON.stringify({ ...session, user: next })
        );
      }
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      updateUser,
      isMember: user?.role === "member",
      isCoopAdmin: user?.role === "cooperative_admin",
      isPlatformAdmin: user?.role === "platform_admin",
    }),
    [user, token, loading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}