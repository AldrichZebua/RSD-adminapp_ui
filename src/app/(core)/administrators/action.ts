/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { safeApiRequest } from "@/lib/safeApiRequest";
import { revalidatePath } from "next/cache";
import { getCurrentAdministrator } from "@/lib/session";
import { RoleDropdownResponse } from "../../../../types/responses/roles";
import { AdministratorSectionCheckRequest, checkAdministratorSections } from "@/components/administrator/lib/administrators_section";
import { AdministratorsIndexResponse, AdministratorsShowResponse, AdministratorsCreateResponse, AdministratorsUpdateResponse, AdministratorsDeleteResponse } from "../../../../types/responses/administrators";

export const checkPermission = async () => {
  const administrator = await getCurrentAdministrator();
  const requestSection: AdministratorSectionCheckRequest = [
    "administrator_menu",
    "administrator_index",
    "administrator_create",
    "administrator_show",
    "administrator_update",
    "administrator_destroy",
  ]

  return await checkAdministratorSections(administrator!.id, requestSection);
}

export const getIndexAdministrator = async (params: string) => {
  const result = await safeApiRequest<AdministratorsIndexResponse>(
    `${process.env.API_ENDPOINT}/administrators?${params}`,
  );
  console.log(result)
  return result;
};
export const getAdministrator = async (id: string | string[]) => {
  return await safeApiRequest<AdministratorsShowResponse>(
    `${process.env.API_ENDPOINT}/administrators/${id}`,
  );
};
export const createAdministrator = async (params: any) => {
  return await safeApiRequest<AdministratorsCreateResponse>(
    `${process.env.API_ENDPOINT}/administrators`,
    {
      method: 'POST',
      body: JSON.stringify({ administrator: params })
    }
  );
};

export const updateAdministrator = async (id: string, params: any) => {
  const result = await safeApiRequest<AdministratorsUpdateResponse>(
    `${process.env.API_ENDPOINT}/administrators/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ administrator: params })
    }
  );
  revalidatePath(`/administrators/${id}`);
  return result;
};

export const destroyAdministrator = async (id: string) => {
  const result = await safeApiRequest<AdministratorsDeleteResponse>(
    `${process.env.API_ENDPOINT}/administrators/${id}`,
    {
      method: 'DELETE'
    }
  );
  revalidatePath(`/administrators`);
  return result;
};

export const getRoleDropdown = async () => {
  return await safeApiRequest<RoleDropdownResponse>(
    `${process.env.API_ENDPOINT}/roles/dropdown`
  );
};