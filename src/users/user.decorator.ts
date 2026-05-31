import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

type AuthenticatedRequest = Request & {
  user: JwtPayload;
};

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.user;
  },
);
