import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facturation } from 'src/database/entities/facturation.entity';
import { Laboratory } from 'src/database/entities/lab.entity';
import { Branch } from 'src/database/entities/Pdv.entity';
import { User } from 'src/database/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';


@Module({
  imports: [TypeOrmModule.forFeature([User, Laboratory, Facturation, Branch]), JwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JWTStrategy, JwtService],
})
export class AuthModule { }
