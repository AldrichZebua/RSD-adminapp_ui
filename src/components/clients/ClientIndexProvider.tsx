"use client"

import { ReactNode, createContext, useContext } from "react";
import { ClientSectionPermission } from "./lib/client_section";


type ClientIndexContextProps = {
  permission: ClientSectionPermission;
};

const ClientIndexContext = createContext<ClientIndexContextProps | null>(null);

export const useClientIndexContext = (): ClientIndexContextProps => {
  const ctx = useContext(ClientIndexContext);
  if (ctx) {
    return ctx;
  } else {
    throw new Error("useClientIndexContext can be used inside ClientIndexProvider");
  }
};

type ClientIndexProviderProps = Pick<ClientIndexContextProps, "permission"> & {
  children: ReactNode;
};

export const ClientIndexProvider = ({ children, permission }: ClientIndexProviderProps) => {
  return (
    <ClientIndexContext.Provider value={{ permission }}>
      {children}
    </ClientIndexContext.Provider>
  );
};