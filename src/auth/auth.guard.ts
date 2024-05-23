import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authToken = request.headers.authorization;
    if (!authToken) {
      throw new UnauthorizedException('No token Provided');
    }
    try {
      const token = authToken.split(' ')[1];
      const decode = this.jwtService.verify(token);
      (request as any).user = decode;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token ', error);
    }
  }
}
