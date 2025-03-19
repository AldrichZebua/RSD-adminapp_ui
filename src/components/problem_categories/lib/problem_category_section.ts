"use server"
import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type ProblemCategorySections =
  | "problem_category_menu"
  | "problem_category_index"
  | "problem_category_create"
  | "problem_category_show"
  | "problem_category_update"
  | "problem_category_destroy"
  | "problem_category_activate"
  | "problem_category_deactivate";
export type ProblemCategorySectionPermission = Record<ProblemCategorySections, boolean>;
export type ProblemCategorySectionCheckRequest = Array<ProblemCategorySections>;

export const checkProblemCategorySections = async (
  administratorId: string,
  sections: ProblemCategorySectionCheckRequest,
): Promise<ProblemCategorySectionPermission> => {
  const result: ProblemCategorySectionPermission = {
    problem_category_menu: false,
    problem_category_index: false,
    problem_category_create: false,
    problem_category_show: false,
    problem_category_update: false,
    problem_category_destroy: false,
    problem_category_activate: false,
    problem_category_deactivate: false
  };

  for (const section of sections) {
    result[section] = (await redis.lpos(`ADMINISTRATOR:${administratorId}:ACCESS_SECTION`, section)) !== null;
  }
  return result;
};