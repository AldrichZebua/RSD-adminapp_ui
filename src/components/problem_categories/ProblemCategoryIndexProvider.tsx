"use client"

import { ReactNode, createContext, useContext } from "react";
import { ProblemCategorySectionPermission } from "./lib/problem_category_section";


type ProblemCategoryIndexContextProps = {
  permission: ProblemCategorySectionPermission;
};

const ProblemCategoryIndexContext = createContext<ProblemCategoryIndexContextProps | null>(null);

export const useProblemCategoryIndexContext = (): ProblemCategoryIndexContextProps => {
  const ctx = useContext(ProblemCategoryIndexContext);
  if (ctx) {
    return ctx;
  } else {
    throw new Error("useProblemCategoryIndexContext can be used inside ProblemCategoryIndexProvider");
  }
};

type ProblemCategoryIndexProviderProps = Pick<ProblemCategoryIndexContextProps, "permission"> & {
  children: ReactNode;
};

export const ProblemCategoryIndexProvider = ({ children, permission }: ProblemCategoryIndexProviderProps) => {
  return (
    <ProblemCategoryIndexContext.Provider value={{ permission }}>
      {children}
    </ProblemCategoryIndexContext.Provider>
  );
};