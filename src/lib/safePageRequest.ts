import Redis from "ioredis";
import { createRedisInstance } from "./redis";
import { User } from "next-auth";
import { getCurrentAdministrator } from "./session";


const redis: Redis = createRedisInstance();

export const safePageRequest = async <T>(section: T): Promise<boolean> => {
  const pageRequest: string = section as string;
  const administrator: User | undefined = await getCurrentAdministrator();
  if (administrator === undefined) return false;

  const alreadyGranted: boolean = await redis.lpos(`ADMINISTRATOR:${administrator.id}:GRANTED_SECTION`, pageRequest) !== null;
  if (alreadyGranted) return true;

  return await redis.lpos(`ADMINISTRATOR:${administrator.id}:ACCESS_SECTION`, pageRequest) !== null;
}