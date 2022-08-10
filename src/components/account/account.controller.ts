import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUserDto } from "../user/dto/register-user.dto";
import { UpdatePasswordDto, UpdatePasswordRequest } from "../user/dto/update-password.dto";
import { UserService } from '../user/user.service';

@Controller('account')
export class AccountController {
  constructor(private userService: UserService) { }

  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterUserDto> {
    return this.userService.registerUser(registerUserDto);
  }

  @Post('change-password-request')
  changePasswordRequest(@Body() changePasswordModel: UpdatePasswordRequest) {
    return this.userService.ChangePasswordRequest(changePasswordModel);
  }

  @Post('change-password')
  changePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.userService.changeUserPassword(updatePasswordDto);
  }
}