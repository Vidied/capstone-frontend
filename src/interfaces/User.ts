export type Role = "ROLE_ADMIN" | "ROLE_USER";

export interface RoleObject {
  id: number;
  name: Role;
}

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  roles: Role[];
}
