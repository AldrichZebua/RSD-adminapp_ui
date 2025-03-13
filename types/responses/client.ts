import { ClientEntity } from "../entities/client";
import { Role } from "../entities/roles";

export type ClientIndexResponse = {
  data: ClientEntity[],
  current_page: number,
  total: number;
  dependencies: any,
};

export type ClientShowResponse = {
  client: ClientEntity;
  roles: Array<Role>;
};

export type ClientCreateResponse = {
  message: string,
  client: ClientEntity;
};

export type ClientUpdateResponse = {
  message: string,
  client: ClientEntity;
};

export type ClientDeleteResponse = {
  message: string;
  client: ClientEntity;
};