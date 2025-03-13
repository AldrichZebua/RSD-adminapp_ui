export type Administrator = {
  id: string;
  username: string;
};

export type AdministratorEntity = Administrator & {
  created_at: string;
  username: string;

  email: string;
  location_ids: [];
  role_ids: [];
  roles_metadata: {
    [x: string]: any;
    id: string;
    name: string;
  };
  updated_at: string;
};