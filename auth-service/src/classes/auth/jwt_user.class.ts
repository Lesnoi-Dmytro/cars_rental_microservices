import type { Role } from '@prisma/client';

export class JwtUser {
  public id: number;
  public email: string;
  public role: Role;
}
