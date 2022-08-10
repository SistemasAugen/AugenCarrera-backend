import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Get(':id')
  getUser(@Param("id") id: number, @Query('select') selectQuery: string) {
    const selectArray = selectQuery?.split(",");
    return this.userService.getUser(id, selectArray);
  }

  @Get(':uniqueName')
  getUserByUniqueName(@Param("uniqueName") uniqueName: string) {
    return this.userService.getUserByUniqueName(uniqueName);
  }

}
