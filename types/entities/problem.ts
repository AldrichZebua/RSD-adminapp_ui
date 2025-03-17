import { ProblemCategoryEntity } from "./problem_category"

export type StatusHistoryEntity = {
  status_at: string,
  status_id: string
}

export type ProblemEntity = {
  id: string,
  created_at: string,
  description: string,
  problem_category: ProblemCategoryEntity,
  status_at: string,
  status_history: StatusHistoryEntity[],
  status_id: string,
  status_label: string,
  title: string,
  updated_at: string
}