import { Body, Controller, Get, HttpCode, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateInfo, UpdateInfoAdmin, UserLogin, UserRegis } from './entities/user.entity';
import { ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('User management')
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
  register(@Body() body: UserRegis) {
    return this.userService.register(body);
  }

  @HttpCode(200)
  @Post('/login')
  login(@Body() body: UserLogin) {
    return this.userService.login(body);
  }

  @HttpCode(200)
  @ApiQuery({
    name: 'keyword',
    required: false,
  })

  @HttpCode(200)
  @Post('/get-user-list')
  getUserList(@Query('keyword') keyword: string): Promise<users[]> {
    return this.userService.getUserList(keyword);
  }

  @HttpCode(200)
  @ApiQuery({
    name:'keyword',
    required:false
  })
  @Post('/get-user-list-page')
    getUserListPage(@Query('keyword') keyword:string, @Query('page') page:string, @Query('quantity') quantity:string){
      let props={keyword,page,quantity}
      return this.userService.getUserListPage(props);

    }

    @HttpCode(200)
    @Post('/find-user')
    findUser(@Query('name') name:string){
      return this.userService.findUser(name);
    }

    
  @HttpCode(200)
  @Post('/find-user-page')
    findUserPage(@Query('name') name:string, @Query('page') page:string, @Query('quantity') quantity:string){
      let props={name,page,quantity}
      return this.userService.getUserListPage(props);
    }
    
    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    @Get('/user-info')
    getUserInfo(@Req() req:Request){
      let tokenDecode = req.user;
      return this.userService.getUserInfo(tokenDecode);
    }

    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @ApiQuery({
      name:'keyword',
      required:false
    })
    @HttpCode(200)
    @Post('/get-user-info')
    getUserInfoForAdmin(@Query('keyword') keyword:string, @Req() req:Request){
      let tokenDecode = req.user;
      return this.userService.getUserInfoForAdmin({tokenDecode,keyword});
    }

    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(201)
    @Post('/add-user')
    addUser(@Body() body:UserRegis, @Req() req:Request){
      let tokenDecode = req.user;
      return this.userService.addUser({body,tokenDecode})
    }

    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    @Put('/update-user-info')
    updateUserInfo(@Body() body:UpdateInfo, @Req() req:Request){
      let tokenDecode = req.user;
      return this.userService.updateUserInfo({body,tokenDecode})
    }

    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    @Post('/update-user-info-for-admin')
    updateUserInfoForAdmin(@Req() req:Request, @Body() body:UpdateInfoAdmin){
      let tokenDecode = req.user;
      return this.userService.updateUserInfoForAdmin({body,tokenDecode});
    
    }

    @ApiSecurity('token')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    @Post('/delete-user')
    deleteUser(@Req() req:Request, @Query("email") email:string){
      let tokenDecode = req.user;
      return this.userService.deleteUser({email,tokenDecode});
    }


    
  



    
  }

