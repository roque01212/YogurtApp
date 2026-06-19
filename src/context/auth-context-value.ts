import { createContext } from "react";
import type { AuthContextValue } from "../auth/authTypes";

export const AuthContext = createContext({} as AuthContextValue);
