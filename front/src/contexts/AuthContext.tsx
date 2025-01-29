import { createContext, PropsWithChildren, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Maybe } from "../models/common";
import type { User } from "../models/User";

const LOCAL_STORAGE_USER_KEY = "user";

interface AuthContextType {
  user: Maybe<User>;
  setUser: React.Dispatch<React.SetStateAction<Maybe<User>>>;
}

const AuthContext = createContext<Maybe<AuthContextType>>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useLocalStorage<Maybe<User>>(
    LOCAL_STORAGE_USER_KEY,
    null
  );

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
