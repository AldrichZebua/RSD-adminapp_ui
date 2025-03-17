/* eslint-disable @typescript-eslint/no-explicit-any */

"use server"
import { AdministratorEntity } from "../entities/administrators";
import { Role } from "../entities/roles";

export type AdministratorsIndexResponse = {
  data: AdministratorEntity[],
  current_page: number,
  total: number;
  dependencies: any,
};

export type AdministratorsShowResponse = {
  administrator: AdministratorEntity;
  roles: Array<Role>;
};

export type AdministratorsCreateResponse = {
  message: string,
  administrator: AdministratorEntity;
};

export type AdministratorsUpdateResponse = {
  message: string,
  administrator: AdministratorEntity;
};

export type AdministratorsDeleteResponse = {
  message: string;
  administrator: AdministratorEntity;
};
export type AdministratorsPreparationResponse = {
  locations: Array<Location>;
};