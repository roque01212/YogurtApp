import { createContext, useEffect, useState } from "react";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";
import type { AuthContextValue, AuthStatus, UserRole } from "../auth/authTypes";
import { getUserRole, loginWithEmail, logoutUser } from "../auth/authService";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext({} as AuthContextValue);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");

  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginWithEmail(email, password);
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();

      setUser(null);
      setRole(null);
      setAuthStatus("not-authenticated");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  useEffect(() => {
    const manejarCambioDeUsuario = async (currentUser: User | null) => {
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setRole(null);
        setAuthStatus("not-authenticated");
        setLoading(false);
        return;
      }

      try {
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
        setAuthStatus("authenticated");
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        setRole(null);
        setAuthStatus("not-authenticated");
      } finally {
        setLoading(false);
      }
    };
    const unsubscribe = onAuthStateChanged(auth, manejarCambioDeUsuario);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAdmin: role === "admin",
        isViewer: role === "viewer",
        authStatus,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
