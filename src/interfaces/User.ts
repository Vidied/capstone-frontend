export type Role = "ROLE_ADMIN" | "ROLE_USER";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: Role;
}
