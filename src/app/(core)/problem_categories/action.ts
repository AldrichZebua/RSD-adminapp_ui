/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  checkProblemCategorySections,
  ProblemCategorySectionCheckRequest,
} from "@/components/problem_categories/lib/problem_category_section";
import { getCurrentAdministrator } from "@/lib/session";
import {
  ProblemCategoryCreateResponse,
  ProblemCategoryDeleteResponse,
  ProblemCategoryIndexResponse,
  ProblemCategoryShowResponse,
  ProblemCategoryUpdateResponse,
} from "../../../../types/responses/problem_category";
import { safeApiRequest } from "@/lib/safeApiRequest";
import { revalidatePath } from "next/cache";

export const checkPermission = async () => {
  const administrator = await getCurrentAdministrator();
  const requestSection: ProblemCategorySectionCheckRequest = [
    "problemCategory_menu",
    "problemCategory_index",
    "problemCategory_create",
    "problemCategory_show",
    "problemCategory_update",
    "problemCategory_destroy",
    "problemCategory_activate",
    "problemCategory_deactivate",
  ];
  return await checkProblemCategorySections(administrator!.id, requestSection);
};

export const getIndexProblemCategory = async (params: string) => {
  return await safeApiRequest<ProblemCategoryIndexResponse>(
    `${process.env.API_ENDPOINT}/problem_categories/${params}`
  );
};
export const getProblemCategory = async (id: string | string[]) => {
  return await safeApiRequest<ProblemCategoryShowResponse>(
    `${process.env.API_ENDPOINT}/problem_categories/${id}`
  );
};
export const createProblemCategory = async (params: any) => {
  return await safeApiRequest<ProblemCategoryCreateResponse>(
    `${process.env.API_ENDPOINT}/problem_categories`,
    {
      method: "POST",
      body: JSON.stringify({ ProblemCategory: params }),
    }
  );
};

export const updateProblemCategory = async (id: string, params: any) => {
  const result = await safeApiRequest<ProblemCategoryUpdateResponse>(
    `${process.env.API_ENDPOINT}/problem_categories/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ ProblemCategory: params }),
    }
  );
  revalidatePath(`/problem_categories/${id}`);
  return result;
};

export const destroyProblemCategory = async (id: string) => {
  const result = await safeApiRequest<ProblemCategoryDeleteResponse>(
    `${process.env.API_ENDPOINT}/problem_categories/${id}`,
    {
      method: "DELETE",
    }
  );
  revalidatePath(`/problem_categories`);
  return result;
};
