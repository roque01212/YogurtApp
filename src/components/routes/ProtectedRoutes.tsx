import { AuthContext } from "@/context/AuthContext";
import { use, type PropsWithChildren } from "react";
import { Navigate } from "react-router";

export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = use(AuthContext);

  if (authStatus === "checking") return null;

  if (authStatus === "not-authenticated")
    return <Navigate to="/login" replace />;

  return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
  const { isAdmin } = use(AuthContext);

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
  const { authStatus } = use(AuthContext);

  if (authStatus === "checking") return null;
  if (authStatus === "authenticated") return <Navigate to="/" replace />;
  return children;
};
