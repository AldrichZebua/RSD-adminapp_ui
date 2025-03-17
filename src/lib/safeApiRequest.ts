import { getCurrentAdministrator } from "./session";

export type ErrorResponse = {
  message: string;
};

export type SafeApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type SafeApiErrorResponse = {
  message: string;
  success: false;
  data: ErrorResponse;
  redirect: boolean;
};

export type SafeApiResponse<T> =
  | SafeApiSuccessResponse<T>
  | SafeApiErrorResponse;

export enum SafeApiRequestContentType {
  JSON_BODY,
  FORM_DATA_BODY,
}

export const safeApiRequest = async <T>(
  path: string,
  options: RequestInit = {},
  contentType: SafeApiRequestContentType = SafeApiRequestContentType.JSON_BODY
): Promise<SafeApiResponse<T>> => {
  const administrator = await getCurrentAdministrator(false);
  if (administrator === undefined) {
    return {
      success: false,
      redirect: true,
      data: { message: "invalid session" },
    };
  }
  let contentTypes = {};
  if (contentType == SafeApiRequestContentType.JSON_BODY) {
    contentTypes = { "Content-Type": "application/json" };
  }

  const response: Response = await fetch(path, {
    ...options,
    headers: {
      ...contentTypes,
      Authorization: `Bearer ${administrator.accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 402) {
    return {
      success: false,
      redirect: true,
      data: { message: "unauthorized access" },
    };
  }

  if (response.ok) {
    const data: T = await response.json();
    return { success: true, data: data };
  } else {
    const data: ErrorResponse = await response.json();
    return { success: false, redirect: false, data: data };
  }
};
