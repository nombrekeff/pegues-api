import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/models/user.model';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const IsRole = createParamDecorator(
  (data: Role[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const hasPermission = data.some((role) =>
      request.user.roles?.includes(role)
    );

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

    return request.user;
  }
);
