import { ProblemCategoryEntity } from "../entities/problem_category";

export type ProblemCategoryIndexResponse = {
  data: ProblemCategoryEntity[],
  current_page: number,
  total: number;
  dependencies: any,
};

export type ProblemCategoryShowResponse = {
  problemcategory: ProblemCategoryEntity;

};

export type ProblemCategoryCreateResponse = {
  message: string,
  problemcategory: ProblemCategoryEntity;
};

export type ProblemCategoryUpdateResponse = {
  message: string,
  problemcategory: ProblemCategoryEntity;
};

export type ProblemCategoryDeleteResponse = {
  message: string;
  problemcategory: ProblemCategoryEntity;
};