import type { ObjectValues } from "./common";

export const USER_ROLE = {
  User: "user",
  Admin: "admin",
} as const;
export type UserRole = ObjectValues<typeof USER_ROLE>;

export interface User {
  id: number;
  name: string;
  surname: string;
  role: UserRole;
}
