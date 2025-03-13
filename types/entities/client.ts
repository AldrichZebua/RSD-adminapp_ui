export type Client = {
  id: string;
  name: string;
};

export type ClientEntity = Client & {
  created_at: string;
  emails: [];
  name: string;
  remark: string;
  status_id: string;
  status_label: string;
  updated_at: string;
};