/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdministratorEntity } from "./entities/administrators";

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
