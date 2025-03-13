export type ProblemCategory = {
  id: string;
  created_at: string;
  name: string;
  status_id: string;
  status_label: string;
  updated_at: string;
};

export type ProblemCategoryEntity = {
  data: ProblemCategory[];
  current_page: number;
  total: number;
  dependencies: any;
};