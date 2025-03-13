import { ProblemCategory } from "./problem_category";

export type StatusHistory = {
  status_at: string;
  status_id: string;
};

export type Problem = {
  id: string;
  created_at: string;
  description: string;
  problem_category: ProblemCategory;
  status_at: string;
  status_history: StatusHistory[];
  status_id: string;
  status_label: string;
  title: string;
  updated_at: string;
};

export type ProblemEntity = Problem & {
  current_page: number;
  total: number;
  dependencies: {
    [x: string]: any;
  };
};
