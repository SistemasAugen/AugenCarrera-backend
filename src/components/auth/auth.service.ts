import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
const bcrypt = require('bcrypt');
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async validateUser(userIdentifier: string, password: string) {
    try {
      const query = this.usersRepository.createQueryBuilder('user');
      // Verificamos si el user identifier es un id (numerico),
      //si no lo es Number(UserIdentifier) sera NaN que se resuelve como falso
      // Lo que significa que se ingreso un correo o un RFC
      if (!!Number(userIdentifier)) {
        query.where({
          id: Number(userIdentifier)
        })
        // Verificamos si el userIdentifier es un correo buscando un @
      } else if (userIdentifier.includes('@')) {
        query.where({
          email: userIdentifier
        })
      } else {
        // Si se ingreso un RFC se obtiene la informacion desde la tabla de facturacion
        // que tiene una realacion con User
        query.leftJoinAndSelect('user.facturation', 'facturation');
        query.addSelect(['facturation.rfc']);
      }
      // obtener info del usuario segun el whereObject
      const user = await query.addSelect(["user.id", 'user.email', 'user.password']).getOne();
      if(!user) {
        throw new UnauthorizedException("Correo o contraseña incorrectos");
      }
      if (await bcrypt.compare(password, user.password)) {
        return user;
      } else {
        throw new UnauthorizedException("Unauthorized")
      }
    } catch (ex) {
      console.error("ERROR AL REGISTRAR EL USUARIO", ex)
      throw new UnauthorizedException("Unauthorized")
    }
  }

  async login(user: User) {
    const payload = { username: user.email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
