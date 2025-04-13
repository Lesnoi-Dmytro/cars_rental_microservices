import type { Role } from "src/utils/enums/role.esum";

export class JwtUser {
  public id: number;
  public email: string;
  public role: Role;
}
