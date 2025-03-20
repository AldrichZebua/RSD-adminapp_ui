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
    "problem_category_menu",
    "problem_category_index",
    "problem_category_create",
    "problem_category_show",
    "problem_category_update",
    "problem_category_destroy",
    "problem_category_activate",
    "problem_category_deactivate",
  ];
  return await checkProblemCategorySections(administrator!.id, requestSection);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getIndexProblemCategory = async (params: string) => {
  return await safeApiRequest<ProblemCategoryIndexResponse>(
    `${process.env.API_ENDPOINT}/problem_categories`
  );
};
export const getProblemCategory = async (id: string | string[]) => {
  return await safeApiRequest<ProblemCategoryShowResponse>(
    `${process.env.API_ENDPOINT}/problem_categories/${id}`
  );
};
export const createProblemCategory = async (data: { problem_category: { name: string } }) => {
  return await safeApiRequest<ProblemCategoryCreateResponse>(
    `${process.env.API_ENDPOINT}/problem_categories`,
    {
      method: "POST",
      body: JSON.stringify(data),
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
