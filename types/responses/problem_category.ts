import { ProblemCategoryEntity } from "../entities/problem_category";

export type ProblemCategoryIndexResponse = {
  data: ProblemCategoryEntity[];
  current_page: number;
  total: number;
  dependencies: any;
};

export type ProblemCategoryShowResponse = {
  problem_category: ProblemCategoryEntity;
};

export type ProblemCategoryCreateResponse = {
  message: string;
  problem_category: ProblemCategoryEntity;
};

export type ProblemCategoryUpdateResponse = {
  message: string;
};

export type ProblemCategoryDeleteResponse = {
  message: string;
};

export type ProblemCategoryToggleResponse = {
  message: string;
};
