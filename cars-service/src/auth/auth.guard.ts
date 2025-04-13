import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  createParamDecorator,
  SetMetadata,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import type { Role } from 'src/utils/enums/role.esum';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { AuthKeys } from 'src/classes/auth/auth_keys.class';
import type { JwtUser } from 'src/classes/auth/jwt_user.class';
import { ConfigService } from '@nestjs/config';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLE_KEY = 'roles';
export const RequiredRole = (role: Role) => SetMetadata(ROLE_KEY, role);

export const CurrentUser = createParamDecorator(
  (attribute: keyof JwtUser, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user: JwtUser = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }
    return attribute ? user?.[attribute] : user;
  },
);

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly gatewayUrl: string;
  private publicKey: string | undefined = undefined;

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly http: HttpService,
    configService: ConfigService,
  ) {
    this.gatewayUrl = configService.get<string>('GATEWAY_URL')!;
  }

  private async getPublicKey() {
    if (!this.publicKey) {
      const keysResponse = await firstValueFrom(
        this.http.get<AuthKeys>(`${this.gatewayUrl}/api/auth/keys`),
      );
      this.publicKey = keysResponse.data.publicKey;
    }

    return this.publicKey;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let user;
    try {
      const { sub, ...data } = await this.jwtService.verifyAsync(token, {
        publicKey: await this.getPublicKey(),
      });
      user = { id: sub, ...data };
    } catch (err) {
      throw new UnauthorizedException();
    }

    if (requiredRole && user.role !== requiredRole) {
      throw new ForbiddenException('Invalid role');
    }

    request.user = user;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
