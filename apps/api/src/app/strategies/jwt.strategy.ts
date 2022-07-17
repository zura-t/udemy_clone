import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { IJWTPayload } from "@udemy-clone/interfaces";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    })
  }

  async validate({id}: IJWTPayload) {
    return id;
  }
}