"use server";
import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type AdministratorSections =
  | "administrator_menu"
  | "administrator_index"
  | "administrator_create"
  | "administrator_show"
  | "administrator_update"
  | "administrator_destroy";
export type AdministratorSectionPermission = Record<
  AdministratorSections,
  boolean
>;
export type AdministratorSectionCheckRequest = Array<AdministratorSections>;

export const checkAdministratorSections = async (
  administratorId: string,
  sections: AdministratorSectionCheckRequest
): Promise<AdministratorSectionPermission> => {
  const result: AdministratorSectionPermission = {
    administrator_menu: false,
    administrator_index: false,
    administrator_create: false,
    administrator_show: false,
    administrator_update: false,
    administrator_destroy: false,
  };

  for (const section of sections) {
    result[section] =
      (await redis.lpos(
        `ADMINISTRATOR:${administratorId}:ACCESS_SECTION`,
        section
      )) !== null;
  }

  return result;
};
