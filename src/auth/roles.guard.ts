import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const { authorization } = req.headers;
      if (!authorization) {
        throw new UnauthorizedException({
          message: 'Authorization headers are required',
        });
      }

      const authType = authorization.split(' ')[0];
      if (authType !== 'Bearer') {
        throw new UnauthorizedException({
          message: 'Authorization type must be Bearer',
        });
      }

      const token = authorization.split(' ')[1];

      const user = this.jwtService.verify(token);
      req.user = user;

      console.log(requiredRoles)
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (e) {
      const message = e?.message || 'User has not permission';
      throw new UnauthorizedException({ message });
    }
  }
}
