import { NextRequest } from "next/server";
import { decode, JWT } from "next-auth/jwt";

export type SessionCheckPayload = {
  status: "authenticated" | "unauthenticated" | "expired";
  message: string;
};

export const validateSessionToken = async (
  request: NextRequest
): Promise<SessionCheckPayload> => {
  let sessionToken: string | undefined = request.cookies.get(
    "next-auth.session-token"
  )?.value;
  if (sessionToken === undefined) {
    sessionToken = request.cookies.get(
      "__Secure-next-auth.session-token"
    )?.value;
  }

  if (sessionToken === undefined)
    return { status: "unauthenticated", message: "Session not found" };

  try {
    const decodedSession: JWT | null = await decode({
      token: sessionToken,
      secret: `${process.env.NEXTAUTH_SECRET}`,
    });

    if (decodedSession === null)
      return { status: "unauthenticated", message: "Session not found" };

    const currentTime: number = Math.floor(new Date().getTime() / 1000);

    if (currentTime < parseInt(`${decodedSession.exp}`)) {
      return { status: "authenticated", message: "Session valid" };
    } else {
      return { status: "expired", message: "Session expired" };
    }
  } catch (e) {
    console.error("Error decoding session token:", e);
    return { status: "expired", message: "Session expired" };
  }
};
