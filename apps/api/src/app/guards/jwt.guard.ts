import { AuthGuard } from "@nestjs/passport";

export class JWtAuthGuard extends AuthGuard('jwt') {}