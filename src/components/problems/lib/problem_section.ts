"use server"
import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type ProblemSections =
  | "problem_menu"
  | "problem_index"
  | "problem_create"
  | "problem_show"
  | "problem_update"
  | "problem_destroy"
  | "problem_activate"
  | "problem_deactivate";
export type ProblemSectionPermission = Record<ProblemSections, boolean>;
export type ProblemSectionCheckRequest = Array<ProblemSections>;

export const checkProblemSections = async (
  administratorId: string,
  sections: ProblemSectionCheckRequest,
): Promise<ProblemSectionPermission> => {
  const result: ProblemSectionPermission = {
    problem_menu: false,
    problem_index: false,
    problem_create: false,
    problem_show: false,
    problem_update: false,
    problem_destroy: false,
    problem_activate: false,
    problem_deactivate: false
  };

  for (const section of sections) {
    result[section] = (await redis.lpos(`ADMINISTRATOR:${administratorId}:ACCESS_SECTION`, section)) !== null;
  }
  return result;
};