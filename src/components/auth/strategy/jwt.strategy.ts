import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/database/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  authService: any;
  constructor(@InjectRepository(User)
  private usersRepository: Repository<User>,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: {
        id: payload.id
      }
    })
    if (user) {
      return { userId: payload.id, username: payload.email };
    }
    else {
      throw new UnauthorizedException("No autorizado")
    }
  }
}