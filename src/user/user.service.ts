import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getUserType() {
    let data = [
      {
        maLoaiNguoiDung: 'KhachHang',
        tenLoai: 'Khách hàng',
      },
      {
        maLoaiNguoiDung: 'QuanTri',
        tenLoai: 'Quản trị',
      },
    ];
    return data;
  }

  async register(body:User){
    let {user_name,pass_word,phone_number,email,full_name}=body;
    let passCrypt = bcrypt.hashSync(pass_word,10);
    let checkEmail = await this.prisma.users.findFirst({where:{email}});
    if (checkEmail){
      throw new BadRequestException("Email already exists!")
    }
    let newUser = {
      user_name,
      pass_word: passCrypt,
      email,
      phone_number,
      user_type: "user",
      full_name,
    };
    await this.prisma.users.create({data:newUser});
    return {
    "statusCode": 400,
    "message": "Không tìm thấy tài nguyên!",
    "content": "Email đã tồn tại!",
    "dateTime": "2023-12-16T10:55:15.2342014+07:00",
    "messageConstants": null
    }

}
