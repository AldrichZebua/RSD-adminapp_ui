import Redis from "ioredis";
import { createRedisInstance } from "./redis";
import { User } from "next-auth";
import { getCurrentAdministrator } from "./session";
import { redirect, RedirectType } from "next/navigation";


const redis: Redis = createRedisInstance();

const safePageRequest = async <T>(section: T): Promise<boolean> => {
  const pageRequest: string = section as string;
  const administrator: User | undefined = await getCurrentAdministrator();
  if (administrator === undefined) return false;

  const alreadyGranted: boolean = await redis.lpos(`ADMINISTRATOR:${administrator.id}:GRANTED_SECTION`, pageRequest) !== null;
  if (alreadyGranted) return true;

  
  return await redis.lpos(`ADMINISTRATOR:${administrator.id}:ACCESS_SECTION`, pageRequest) !== null;
}


export const pagePermissionCheck = async <T>(section: T) => {
  const allow = await safePageRequest(section);
  if (allow) return;

  redirect('/dashboard', RedirectType.replace);
}