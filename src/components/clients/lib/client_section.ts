"use server"

import Redis from "ioredis";
import { createRedisInstance } from "@/lib/redis";

const redis: Redis = createRedisInstance();

export type ClientSections =
  | "client_menu"
  | "client_index"
  | "client_create"
  | "client_show"
  | "client_update"
  | "client_destroy"
export type ClientSectionPermission = Record<ClientSections, boolean>;
export type ClientSectionCheckRequest = Array<ClientSections>;

export const checkClientSections = async (
  administratorId: string,
  sections: ClientSectionCheckRequest,
): Promise<ClientSectionPermission> => {
  const result: ClientSectionPermission = {
    client_menu: false,
    client_index: false,
    client_create: false,
    client_show: false,
    client_update: false,
    client_destroy: false,
  };

  for (const section of sections) {
    result[section] = (await redis.lpos(`ADMINISTRATOR:${administratorId}:ACCESS_SECTION`, section)) !== null;
  }
  return result;
};