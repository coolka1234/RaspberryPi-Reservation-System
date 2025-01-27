import { createContext, PropsWithChildren, useContext, useState } from "react";
import type { Maybe } from "../types";
import type { User } from "../models/User";

interface AuthContextType {
  user: Maybe<User>;
  setUser: React.Dispatch<React.SetStateAction<Maybe<User>>>;
}

const AuthContext = createContext<Maybe<AuthContextType>>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<Maybe<User>>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useLogIn = (): ((user: User) => void) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined.");
  }

  return (user: User) => authContext.setUser(user);
};

export const useLogOut = (): (() => void) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext is undefined.");
  }

  return () => authContext.setUser(null);
};

export const useUser = (): Maybe<User> => {
  return useContext(AuthContext)?.user;
};
