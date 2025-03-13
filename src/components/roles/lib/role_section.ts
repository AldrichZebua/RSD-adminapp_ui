"use server"
import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type RoleSections =
  | "role_menu"
  | "role_index"
  | "role_create"
  | "role_show"
  | "role_update"
  | "role_destroy"
  | "role_activate"
  | "role_deactivate";
export type RoleSectionPermission = Record<RoleSections, boolean>;
export type RoleSectionCheckRequest = Array<RoleSections>;

export const checkRoleSections = async (
  administratorId: string,
  sections: RoleSectionCheckRequest,
): Promise<RoleSectionPermission> => {
  const result: RoleSectionPermission = {
    role_menu: false,
    role_index: false,
    role_create: false,
    role_show: false,
    role_update: false,
    role_destroy: false,
    role_activate: false,
    role_deactivate: false
  };

  for (const section of sections) {
    result[section] = (await redis.lpos(`ADMINISTRATOR:${administratorId}:ACCESS_SECTION`, section)) !== null;
  }
  return result;
};