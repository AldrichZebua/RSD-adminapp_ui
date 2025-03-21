/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdministratorEntity } from "./entities/administrators";
import { ClientEntity } from "./entities/client";

export type PaginationParams = {
  current: number;
  pageSize: number;
};

export type TableDefaultParams<T> = {
  pagination: PaginationParams;
  order: "ascend" | "descend";
  field: keyof T;
  tag: string;
  filters?: any;
};

export const administratorDefaultTableParams: TableDefaultParams<AdministratorEntity> =
  {
    pagination: {
      current: 1,
      pageSize: 10,
    },
    order: "ascend",
    field: "username",
    tag: "ADMINISTRATOR",
  };


export const clientDefaultTableParams : TableDefaultParams<ClientEntity> = 
{
  pagination: {
    current: 1,
    pageSize: 10,
  },
  order: "ascend",
  field: "name",
  tag: "CLIENT",
}

export const roleDefaultTableParams : TableDefaultParams<ClientEntity> = 
{
  pagination: {
    current: 1,
    pageSize: 10,
  },
  order: "ascend",
  field: "name",
  tag: "ROLE",
}

export const problemDefaultTableParams : TableDefaultParams<ClientEntity> = 
{
  pagination: {
    current: 1,
    pageSize: 10,
  },
  order: "ascend",
  field: "name",
  tag: "PROBLEM",
}

export const problemCategoryDefaultTableParams : TableDefaultParams<ClientEntity> = 
{
  pagination: {
    current: 1,
    pageSize: 10,
  },
  order: "ascend",
  field: "name",
  tag: "PROBLEM_CATEGORY",
}