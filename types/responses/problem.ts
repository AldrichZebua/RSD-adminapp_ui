/* eslint-disable @typescript-eslint/no-explicit-any */
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
  problem: ProblemEntity;
  message: string;
};

export type ProblemUpdateResponse = {
  message: string;
  problem: ProblemEntity;
};

export type ProblemDeleteResponse = {
  message: string;
  problem: ProblemEntity;
};

export type ProblemSubmitResponse = {
  message: string;
};
