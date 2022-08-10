import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { UserLogin } from './dtos/login';
import { LocalAuthGuard } from './guards/localAuth.guard';

@Controller('auth')
// login & logout
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: Request) {
    const token = request.user;
    return token;
  }

}
