import { createContext, PropsWithChildren, useContext, useState } from "react";
import type { Maybe } from "../models/common";

interface RefetchContextType {
  doRefetch: boolean;
  setDoRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const RefetchContext = createContext<Maybe<RefetchContextType>>(null);

export const RefetchProvider = ({ children }: PropsWithChildren) => {
  const [doRefetch, setDoRefetch] = useState<boolean>(false);

  return (
    <RefetchContext.Provider value={{ doRefetch, setDoRefetch }}>
      {children}
    </RefetchContext.Provider>
  );
};

export const useDoRefetch = (): boolean => {
  const refetchContext = useContext(RefetchContext);

  if (!refetchContext) {
    throw new Error("RefetchContext is undefined.");
  }

  return refetchContext.doRefetch;
};

export const useToggleRefetch = (): (() => void) => {
  const refetchContext = useContext(RefetchContext);

  if (!refetchContext) {
    throw new Error("RefetchContext is undefined.");
  }

  return () => refetchContext.setDoRefetch((prev) => !prev);
};
