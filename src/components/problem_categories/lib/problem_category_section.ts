"use server"
import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type ProblemCategorySections =
  | "problemCategory_menu"
  | "problemCategory_index"
  | "problemCategory_create"
  | "problemCategory_show"
  | "problemCategory_update"
  | "problemCategory_destroy"
  | "problemCategory_activate"
  | "problemCategory_deactivate";
export type ProblemCategorySectionPermission = Record<ProblemCategorySections, boolean>;
export type ProblemCategorySectionCheckRequest = Array<ProblemCategorySections>;

export const checkProblemCategorySections = async (
  administratorId: string,
  sections: ProblemCategorySectionCheckRequest,
): Promise<ProblemCategorySectionPermission> => {
  const result: ProblemCategorySectionPermission = {
    problemCategory_menu: false,
    problemCategory_index: false,
    problemCategory_create: false,
    problemCategory_show: false,
    problemCategory_update: false,
    problemCategory_destroy: false,
    problemCategory_activate: false,
    problemCategory_deactivate: false
  };

  for (const section of sections) {
    result[section] = (await redis.lpos(`ADMINISTRATOR:${administratorId}:ACCESS_SECTION`, section)) !== null;
  }
  return result;
};