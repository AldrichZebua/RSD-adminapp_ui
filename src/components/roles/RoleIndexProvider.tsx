"use client"

import { ReactNode, createContext, useContext } from "react";
import { RoleSectionPermission } from "./lib/role_section";


type RoleIndexContextProps = {
  permission: RoleSectionPermission;
};

const RoleIndexContext = createContext<RoleIndexContextProps | null>(null);

export const useRoleIndexContext = (): RoleIndexContextProps => {
  const ctx = useContext(RoleIndexContext);
  if (ctx) {
    return ctx;
  } else {
    throw new Error("useRoleIndexContext can be used inside RoleIndexProvider");
  }
};

type RoleIndexProviderProps = Pick<RoleIndexContextProps, "permission"> & {
  children: ReactNode;
};

export const RoleIndexProvider = ({ children, permission }: RoleIndexProviderProps) => {
  return (
    <RoleIndexContext.Provider value={{ permission }}>
      {children}
    </RoleIndexContext.Provider>
  );
};