import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @HttpCode(200)
  @Get('/get-user-type')
  getUserType() {
    return this.userService.getUserType();
  }
  @HttpCode(201)
  @Post('/register')
  register(@Body() body: User) {
    return this.userService.register(body);
  }
}
