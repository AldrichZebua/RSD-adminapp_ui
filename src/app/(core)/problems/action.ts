/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import {
  checkProblemSections,
  ProblemSectionCheckRequest,
} from "@/components/problems/lib/problem_section";
import { safeApiRequest } from "@/lib/safeApiRequest";
import { getCurrentAdministrator } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { ProblemCreateResponse, ProblemDeleteResponse, ProblemIndexResponse, ProblemShowResponse, ProblemUpdateResponse } from "../../../../types/responses/problem";
import { ProblemCategoryIndexResponse } from "../../../../types/responses/problem_category";


export const checkPermission = async () => {
  const administrator = await getCurrentAdministrator();
  const requestSection: ProblemSectionCheckRequest = [
    "problem_menu",
    "problem_index",
    "problem_create",
    "problem_show",
    "problem_update",
    "problem_destroy",
    "problem_activate",
    "problem_deactivate",
  ];

  return await checkProblemSections(administrator!.id, requestSection);
};

// export const getIndexProblem = async (params: string) => {
//   return await safeApiRequest<ProblemIndexResponse>(
//     `${process.env.API_ENDPOINT}/problems${params}`
//   );
// };

export const getIndexProblem = async () => {
  return await safeApiRequest<ProblemIndexResponse>(
    `${process.env.API_ENDPOINT}/problems`
  );
};

export const getProblem = async (id: string) => {
  return await safeApiRequest<ProblemShowResponse>(
    `${process.env.API_ENDPOINT}/problems/${id}`
  );
};
export const createProblem = async (params: any) => {
  return await safeApiRequest<ProblemCreateResponse>(
    `${process.env.API_ENDPOINT}/problems`,
    {
      method: "POST",
      body: JSON.stringify({ problem: params }),
    }
  );
};

export const updateProblem = async (id: string, params: any) => {
  console.log(params);
  const result = await safeApiRequest<ProblemUpdateResponse>(
    `${process.env.API_ENDPOINT}/problems/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ problem: params }),
    }
  );
  revalidatePath(`/problems/${id}`);
  return result;
};

export const destroyProblem = async (id: string) => {
  const result = await safeApiRequest<ProblemDeleteResponse>(
    `${process.env.API_ENDPOINT}/problems/${id}`,
    {
      method: "DELETE",
    }
  );
  revalidatePath(`/problems`);
  return result;
};


export const dropProblemCategory = async () => {
  return await safeApiRequest<ProblemCategoryIndexResponse>(
    `${process.env.API_ENDPOINT}/problems_categories`,  
  );
};