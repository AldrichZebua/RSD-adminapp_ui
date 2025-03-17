import { ProblemEntity } from "../entities/problem";

export type ProblemIndexResponse = {
  data: ProblemEntity[];
  current_page: number;
  total: number;
  dependencies: any;
};

export type ProblemShowResponse = {
  problem: ProblemEntity;
};

export type ProblemCreateResponse = {
  message: string;
};

export type ProblemUpdateResponse = {
  message: string;
};

export type ProblemDeleteResponse = {
  message: string;
};

export type ProblemSubmitResponse = {
message: string;
};
