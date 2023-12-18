import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserRegis, UserLogin } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
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

  async register(body: UserRegis) {
    let { user_name, pass_word, phone_number, email, full_name } = body;
    let passCrypt = bcrypt.hashSync(pass_word, 10);
    let checkEmail = await this.prisma.users.findFirst({ where: { email } });
    if (checkEmail) {
      throw new BadRequestException('Email already exists!');
    }
    let newUser = {
      user_name,
      pass_word: passCrypt,
      email,
      phone_number,
      user_type: 'user',
      full_name,
    };
    await this.prisma.users.create({ data: newUser });
    return 'Your account has been created!';
  }

  async login(body: UserLogin) {
    let { email, pass_word } = body;
    let checkEmail = await this.prisma.users.findFirst({ where: { email } });
    if (checkEmail) {
      let checkPass = bcrypt.compareSync(pass_word, checkEmail.pass_word);
      if (checkPass) {
        let { email, full_name, user_id, user_name, phone_number, user_type } =
          checkEmail;
        return this.jwtService.sign(
          {
            email,
            full_name,
            user_id,
            user_name,
            phone_number,
            user_type,
            pass_word: '',
          },
          { expiresIn: '30d', secret: 'MOVIE' },
        );
      } else {
        throw new BadRequestException('The password you entered is incorrect!');
      }
    } else {
      throw new BadRequestException('The email you entered is incorrect!');
    }
  }

  async getUserList(keyword: string): Promise<users[]> {
    let data = await this.prisma.users.findMany({
      where: {
        user_name: {
          contains: keyword,
        },
      },
    });
    return data;
  }

  async getUserListPage(props) {
    let { keyword, page, quantity } = props;
    let count = await this.prisma.users.count({
      where: {
        user_name: {
          contains: keyword,
        },
      },
    });
    let totalPage = Math.ceil(count / Number(quantity));
    let index = (Number(page) - 1) * Number(quantity);
    let data = await this.prisma.users.findMany({
      where: {
        user_name: {
          contains: keyword,
        },
      },
      skip: index,
      take: Number(quantity),
    });
    return {
      currentPage: Number(page),
      quantity: Number(quantity),
      totalPages: totalPage,
      totalCount: count,
      items: data,
    };
  }

  async findUser(name: string) {
    let data = await this.prisma.users.findMany({
      where: {
        full_name: {
          contains: name,
        },
      },
    });
    return data;
  }

  async findUserPage(props) {
    let { name, page, quantity } = props;
    let count = await this.prisma.users.count({
      where: {
        full_name: {
          contains: name,
        },
      },
    });
    let totalPage = Math.ceil(count / Number(quantity));
    let index = (Number(page) - 1) * Number(quantity);
    let data = await this.prisma.users.findMany({
      where: {
        full_name: {
          contains: name,
        },
      },
      skip: index,
      take: Number(quantity),
    });
    return {
      currentPage: Number(page),
      quantity: Number(quantity),
      totalPages: totalPage,
      totalCount: count,
      items: data,
    };
  }

  async getUserInfo(tokenDecode) {
    let { user_id } = tokenDecode;
    let data = await this.prisma.users.findMany({
      where: { user_id },
      include: { ticket: true },
    });
    return data;
  }

  async getUserInfoForAdmin({ tokenDecode, keyword }) {
    let { user_type, user_id } = tokenDecode;
    if (user_type == 'user') {
      throw new UnauthorizedException("You don't have valid role!");
    } else {
      let data = await this.prisma.users.findMany({
        where: { user_name: { contains: keyword } },
        include: { ticket: true },
      });
      return data;
    }
  }

  async addUser({ body, tokenDecode }) {
    let { user_type } = tokenDecode;
    if (user_type == 'user') {
      throw new UnauthorizedException("You don't have valid role!");
    } else {
      let { pass_word, email } = body;
      let checkEmail = await this.prisma.users.findFirst({ where: { email } });
      if (checkEmail) {
        throw new BadRequestException('Email already exists!');
      } else {
        let passCrypt = bcrypt.hashSync(pass_word, 10);
        let data = { ...body, pass_word: passCrypt, user_type: 'user' };
        await this.prisma.users.create({ data: data });
      }
      return 'Account was added successfully!';
    }
  }

  async updateUserInfo({ body, tokenDecode }) {
    let { user_id } = tokenDecode;
    let { email, full_name, phone_number, user_name } = body;
    let InfoUser = await this.prisma.users.findUnique({ where: { user_id } });
    let checkEmail = await this.prisma.users.findFirst({ where: { email } });
    if (checkEmail) {
      throw new BadRequestException('Email already exists!');
    } else {
      InfoUser = { ...InfoUser, email, full_name, phone_number, user_name };
      await this.prisma.users.update({ data: InfoUser, where: { user_id } });
      return 'Updated!';
    }
  }

  async updateUserInfoForAdmin({ body, tokenDecode }) {
    let { user_type } = tokenDecode;
    if (user_type == 'user') {
      throw new UnauthorizedException("You don't have valid role!");
    } else {
      let { email, pass_word, user_name, full_name, user_type, phone_number } =
        body;
      let data = await this.prisma.users.findFirst({ where: { email } });
      let passCrypt = bcrypt.hashSync(pass_word, 10);
      let InfoUpdate = {
        ...data,
        pass_word: passCrypt,
        user_name,
        full_name,
        user_type,
        phone_number,
      };
      await this.prisma.users.update({
        data: InfoUpdate,
        where: { user_id: data.user_id },
      });
      //Update thì phải unique cho trường bình thường hoặc khoá chính, không thì phải dùng many. Hoặc dùng giống trên
    }
  }

  async deleteUser({ email, tokenDecode }) {
    let { user_type } = tokenDecode;
    if (user_type == 'user') {
      throw new UnauthorizedException("You dont't have valid role!");
    } else {
      await this.prisma.users.deleteMany({ where: { email } });
      return 'Account was deleted!';
    }
  }
}
