import { IsMongoId, IsNumber, IsString, Min } from "class-validator";

export class RegisterUserDto {

  @IsString()
  name: string;
  password: string;
  email: string;
}
/* received my controllers */
/* it can exist UpdateUserDto or something */
