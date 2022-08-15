import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/database/entities/user.entity";
import { RegisterUserDto } from "src/components/user/dto/register-user.dto";
import { Repository } from "typeorm";
const bcrypt = require('bcrypt');
import { EmailSenderService } from "src/utils/email-sender/email-sender.service";
import { UpdatePasswordDto, UpdatePasswordPayload, UpdatePasswordRequest } from "./dto/update-password.dto";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { Laboratory } from "src/database/entities/lab.entity";
import { Branch } from "src/database/entities/Pdv.entity";
import { PasswordResets } from "src/database/entities/password-request.entity";
const saltRounds = 12;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Laboratory)
    private laboratoryRepository: Repository<Laboratory>,
    @InjectRepository(PasswordResets)
    private passwordResetsRepository: Repository<PasswordResets>,
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    private emailSenderService: EmailSenderService,
    private jwtService: JwtService
  ) { }

  async validateRegisteredUser(email: string): Promise<void> {
    try {
      const isRegisterUserEmail = await this.usersRepository.findOne({
        where: {
          email: email
        }
      })
      if (isRegisterUserEmail) {
        throw new BadRequestException("Correo ya utilizado");
      }
    } catch (ex) {
      throw ex;
    }
  }

  async registerUser(registerUserDto: RegisterUserDto): Promise<RegisterUserDto> {
    await this.validateRegisteredUser(registerUserDto.email);
    try {
      const generatedPassword = Math.random().toString(36).slice(-8);
      let encriptedPassword = await bcrypt.hash(generatedPassword, saltRounds);
      registerUserDto.password = encriptedPassword;

      const user = await this.usersRepository.save(registerUserDto);
      if (user) {
        await this.emailSenderService.sendTestEmail({
          email: registerUserDto.email,
          subject: 'Usuario creado',
          template: 'user-register',
          templateData: {
            name: registerUserDto.name,
            password: generatedPassword,
            userSiteUrl: process.env.LOGIN_URL
          }
        });
      } else {
        throw new BadRequestException('Error al registrar el usuario');
      }
      return registerUserDto;
    } catch (ex) {
      throw new BadRequestException("Error al registrar el usuario", ex.message);
    }
  }

  async getUser(userId: number, selectArray?: string[]): Promise<User> {
    // su rfc, su pdv -> su lab
    try {
      const user = await this.usersRepository.createQueryBuilder('user')
        .where({
          id: userId
        })
        .leftJoinAndSelect('user.facturation', 'facturation')
        .leftJoinAndSelect('user.branch', 'branch')
        .leftJoinAndSelect('branch.laboratory', 'laboratory')
        .select(selectArray ? selectArray : null)
        .getOne()
      if (user?.password) delete user.password;
      return user;
    } catch (ex) {
      console.error("ERROR AL REGISTRAR EL USUARIO", ex)
      throw new BadRequestException("Usuario no encontrado");
    }
  }

  async getBranch(branchId: number): Promise<Branch> {
    try {
      return await this.branchRepository.findOneBy({
        id: branchId
      })
    } catch (ex) {
      console.error(ex);
      throw new BadRequestException(ex);
    }
  }

  async getLaboratory(laboratoryId: number): Promise<Laboratory> {
    try {
      return await this.laboratoryRepository.findOneBy({
        id: laboratoryId
      })
    } catch (ex) {
      console.error(ex);
      throw new BadRequestException(ex);
    }
  }

  async getUserByUniqueName(uniqueName: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { name: uniqueName }
    });
  }

  async ChangePasswordRequest(changePasswordModel: UpdatePasswordRequest) {
    const user = await this.usersRepository.findOne({
      where: {
        email: changePasswordModel.email
      }
    });
    if (user) {
      const passwordResetToken = randomUUID();
      const token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        changePasswordToken: passwordResetToken
      } as UpdatePasswordPayload)
      const url = `${process.env.SITE_URL}/change-password/${token}` // boton del correo redirige a la vista del cambio de contraseña)
      await this.emailSenderService.sendTestEmail({
        email: user.email,
        subject: 'Cambio de contraseña',
        template: 'change-password',
        templateData: {
          url: url
        }
      }).then(() => {
        this.passwordResetsRepository.save({
          email: user.email,
          token: passwordResetToken
        });
        this.usersRepository.save(user);
      })
    } else {
      throw new NotFoundException("Correo no encontrado");
    }
  }

  async changeUserPassword(changePasswordModel: UpdatePasswordDto) {
    try {
      const payload = this.jwtService.decode(changePasswordModel.token) as UpdatePasswordPayload;
      const changePasswordData = await this.passwordResetsRepository.findOne({
        where: {
          email: payload.email
        }
      });
      const user = await this.usersRepository.findOne({
        where: {
          id: payload.id
        }
      })
      if (changePasswordData.token == payload.changePasswordToken) {
        const encriptedPassword = await bcrypt.hash(changePasswordModel.newPassword, saltRounds);
        user.password = encriptedPassword;
        await this.usersRepository.save(user);
        await this.passwordResetsRepository.remove(changePasswordData);
      } else {
        throw new UnauthorizedException("Token no valido");
      }
    } catch (ex) {
      console.error(ex);
      throw new InternalServerErrorException("Hubo un eror al procesar la peticion");
    }
  }
}