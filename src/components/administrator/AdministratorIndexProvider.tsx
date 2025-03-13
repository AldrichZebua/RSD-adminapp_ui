"use client"

import { ReactNode, createContext, useContext } from "react";
import { AdministratorSectionPermission } from "./lib/administrators_section";


type AdministratorIndexContextProps = {
  permission: AdministratorSectionPermission;
};

const AdministratorIndexContext = createContext<AdministratorIndexContextProps | null>(null);

export const useAdministratorIndexContext = (): AdministratorIndexContextProps => {
  const ctx = useContext(AdministratorIndexContext);
  if (ctx) {
    return ctx;
  } else {
    throw new Error("useAdministratorIndexContext can be used inside AdministratorIndexProvider");
  }
};

type AdministratorIndexProviderProps = Pick<AdministratorIndexContextProps, "permission"> & {
  children: ReactNode;
};

export const AdministratorIndexProvider = ({ children, permission }: AdministratorIndexProviderProps) => {
  return (
    <AdministratorIndexContext.Provider value={{ permission }}>
      {children}
    </AdministratorIndexContext.Provider>
  );
};