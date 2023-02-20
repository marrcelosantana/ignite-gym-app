import { createContext, ReactNode, useState } from "react";
import { User } from "@models/User";

export type AuthContextDataProps = {
  user: User;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
