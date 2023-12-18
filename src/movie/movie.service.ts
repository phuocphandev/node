import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MovieService {
  constructor(private prisma: PrismaService) {}
  async getBanner() {
    let data = await this.prisma.banner.findMany();
    return data;
  }

  async getMovieList(keyword: string) {
    let data = await this.prisma.movie.findMany({
      where: { movie_name: { contains: keyword } },
    });
    return data;
  }

  async getMovieListPage(props){
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
    let data = await this.prisma.movie.findMany({
      where: {
        movie_name: {
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

  async getMovieListPageByDay(props){
    let {keyword,page,quantity,startDay,endDate} = props;
    let count = await this.prisma.users.count({
      where: {
        user_name: {
          contains: keyword,
        },
      },
    });
    let totalPage = Math.ceil(count / Number(quantity));
    let index = (Number(page) - 1) * Number(quantity);
    let data = await this.prisma.movie.findMany({
      where: {
        movie_name: {
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
  }

