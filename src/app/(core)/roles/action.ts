/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { safeApiRequest } from "@/lib/safeApiRequest";

import { revalidatePath } from "next/cache";

import { getCurrentAdministrator } from "@/lib/session";
import {
  checkRoleSections,
  RoleSectionCheckRequest,
} from "@/components/roles/lib/role_section";
import { RoleCreateResponse, RoleDeleteResponse, RoleIndexResponse, RoleShowResponse, RoleUpdateResponse } from "../../../../types/responses/roles";

export const checkPermission = async () => {
  const administrator = await getCurrentAdministrator();
  const requestSection: RoleSectionCheckRequest = [
    "role_menu",
    "role_index",
    "role_create",
    "role_show",
    "role_update",
    "role_destroy",
    "role_activate",
    "role_deactivate",
  ];

  return await checkRoleSections(administrator!.id, requestSection);
};

export const getIndexRole = async (params: string) => {
  return await safeApiRequest<RoleIndexResponse>(
    `${process.env.API_ENDPOINT}/roles/${params}`
  );
};
export const getRole = async (id: string) => {
  return await safeApiRequest<RoleShowResponse>(
    `${process.env.API_ENDPOINT}/roles/${id}`
  );
};
export const createRole = async (params: any) => {
  return await safeApiRequest<RoleCreateResponse>(
    `${process.env.API_ENDPOINT}/roles`,
    {
      method: "POST",
      body: JSON.stringify({ role: params }),
    }
  );
};

export const updateRole = async (id: string, params: any) => {
  console.log(params);
  const result = await safeApiRequest<RoleUpdateResponse>(
    `${process.env.API_ENDPOINT}/roles/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ role: params }),
    }
  );
  revalidatePath(`/roles/${id}`);
  return result;
};

export const destroyRole = async (id: string) => {
  const result = await safeApiRequest<RoleDeleteResponse>(
    `${process.env.API_ENDPOINT}/roles/${id}`,
    {
      method: "DELETE",
    }
  );
  revalidatePath(`/roles`);
  return result;
};

export const getSectionTree = async () => {
  const result = await safeApiRequest<any>(
    `${process.env.API_ENDPOINT}/roles/section_tree`
  );
  if (result.success) {
    return result.data;
  } else {
    return [];
  }
};
