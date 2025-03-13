import { getServerSession, User } from "next-auth";
import { authOptions } from "./auth_providers/authOptions";


export const getCurrentAdministrator = async (sanitized: boolean = true): Promise<User | undefined> => {
  const session = await getServerSession(authOptions);
  if (session == null) return undefined;

  const user = session.user;
  if (user == null) return undefined;

  if (sanitized) {
    user.accessToken = undefined;
  }
  return user;
};
