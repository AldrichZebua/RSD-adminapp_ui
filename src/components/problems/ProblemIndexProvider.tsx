"use client"

import { ReactNode, createContext, useContext } from "react";
import { ProblemSectionPermission } from "./lib/problem_section";


type ProblemIndexContextProps = {
  permission: ProblemSectionPermission;
};

const ProblemIndexContext = createContext<ProblemIndexContextProps | null>(null);

export const useProblemIndexContext = (): ProblemIndexContextProps => {
  const ctx = useContext(ProblemIndexContext);
  if (ctx) {
    return ctx;
  } else {
    throw new Error("useProblemIndexContext can be used inside ProblemIndexProvider");
  }
};

type ProblemIndexProviderProps = Pick<ProblemIndexContextProps, "permission"> & {
  children: ReactNode;
};

export const ProblemIndexProvider = ({ children, permission }: ProblemIndexProviderProps) => {
  return (
    <ProblemIndexContext.Provider value={{ permission }}>
      {children}
    </ProblemIndexContext.Provider>
  );
};