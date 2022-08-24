import {
  CanActivate,
  ExecutionContext, Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();

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

      return true;
    } catch (e) {
      const message = e?.message || 'User is not authorized';
      throw new UnauthorizedException({ message });
    }
  }
}
