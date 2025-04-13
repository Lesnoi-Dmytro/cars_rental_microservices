import type { Role } from 'src/utils/enums/role.esum';

export class AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  regularUser?: {
    phoneNum: string;
    passportId: string;
  };
}
