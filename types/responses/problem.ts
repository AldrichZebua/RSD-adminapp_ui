import { ProblemEntity } from "../entities/problem";
import { ProblemCategory } from "../entities/problem_category";

export type ProblemIndexResponse = {
  data: ProblemEntity[];
  current_page: number;
  total: number;
  dependencies: any;
};

export type ProblemShowResponse = {
  problem: ProblemEntity;
  categories: Array<ProblemCategory>;
};

export type ProblemCreateResponse = {
  message: string;
  problem: ProblemEntity;
};

export type ProblemUpdateResponse = {
  message: string;
  problem: ProblemEntity;
};

export type ProblemDeleteResponse = {
  message: string;
  problem: ProblemEntity;
};

export type ProblemPreparationResponse = {
  categories: Array<ProblemCategory>;
};
