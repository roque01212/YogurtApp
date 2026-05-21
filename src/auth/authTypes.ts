import type { User } from "firebase/auth";

export type UserRole = "admin" | "viewer";
export type AuthStatus = "authenticated" | "not-authenticated" | "checking";

export interface AuthContextValue {
  authStatus: AuthStatus;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  isAdmin: boolean;
  isViewer: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}
