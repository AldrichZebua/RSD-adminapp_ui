/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { safeApiRequest } from "@/lib/safeApiRequest";
import { revalidatePath } from "next/cache";
import { checkClientSections, ClientSectionCheckRequest } from "@/components/clients/lib/client_section";
import { getCurrentAdministrator } from "@/lib/session";
import { ClientCreateResponse, ClientDeleteResponse, ClientIndexResponse, ClientShowResponse, ClientUpdateResponse } from "../../../../types/responses/client";

export const checkPermission = async () => {
  const administrator = await getCurrentAdministrator();
  const requestSection: ClientSectionCheckRequest = [
    "client_menu",
    "client_index",
    "client_create",
    "client_show",
    "client_update",
    "client_destroy",
  ]

  return await checkClientSections(administrator!.id, requestSection);
}

export const getIndexClient = async (params: string) => {
  return await safeApiRequest<ClientIndexResponse>(
    `${process.env.API_ENDPOINT}/clients${params}`,
  );
};
export const getClient = async (id: string | string[]) => {
  return await safeApiRequest<ClientShowResponse>(
    `${process.env.API_ENDPOINT}/clients/${id}`,
  );
};
export const createClient = async (params: any) => {
  return await safeApiRequest<ClientCreateResponse>(
    `${process.env.API_ENDPOINT}/clients`,
    {
      method: 'POST',
      body: JSON.stringify({ client: params })
    }
  );
};

export const updateClient = async (id: string, params: any) => {
  const result = await safeApiRequest<ClientUpdateResponse>(
    `${process.env.API_ENDPOINT}/clients/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ client: params })
    }
  );
  revalidatePath(`/clients/${id}`);
  return result;
};

export const destroyClient = async (id: string) => {
  const result = await safeApiRequest<ClientDeleteResponse>(
    `${process.env.API_ENDPOINT}/clients/${id}`,
    {
      method: 'DELETE'
    }
  );
  revalidatePath(`/clients`);
  return result;
};

// export const getRolesDropdown = async () => {
//   return await safeApiRequest<ClinetDropdownResponse>(
//     `${process.env.API_ENDPOINT}/roles/dropdown`
//   );
// };

// export const prepareAdministrator = async () => {
//   return await safeApiRequest<AdministratorsPreparationResponse>(
//     `${process.env.API_ENDPOINT}/administrators/preparation`
//   );
// };