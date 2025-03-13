export type Role = {
  id: string;
  name: string;
};

export type RoleEntity = Role & {
  created_at: string;
  description: string;
  updated_at: string;
};

export type RoleDetailEntity = RoleEntity & {
  child_nodes: string[];
  parent_nodes: string[];
  rule_set: string[];
};