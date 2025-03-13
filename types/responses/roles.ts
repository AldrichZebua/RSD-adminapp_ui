import { RoleEntity, RoleDetailEntity } from '../entities/roles';

export type RoleIndexResponse = {
  data: RoleEntity[],
  current_page: number,
  total: number;
};

export type RoleShowResponse = {
  role: RoleDetailEntity;
};

export type RoleCreateResponse = {
  message: string,
  role: RoleEntity;
};

export type RoleUpdateResponse = {
  message: string,
  role: RoleEntity;
};

export type RoleDeleteResponse = {
  message: string;
  role: RoleEntity;
};

export type RoleDropdownResponse = {
  roles: Pick<RoleEntity, "id" | "name">[];
};