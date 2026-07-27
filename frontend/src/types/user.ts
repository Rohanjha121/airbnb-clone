export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  is_host: boolean;
  created_at: string;
}
