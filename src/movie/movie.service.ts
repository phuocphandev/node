import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PrismaService } from 'src/prisma.service';
import * as moment from 'moment';

function utcTime(arg:string){
  let inputDay = moment.utc(arg,"YYYY-MM-DD")
  return inputDay.toISOString();
}

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

  async getMovieListPage(props) {
    let { keyword, page, quantity } = props;
    let count = await this.prisma.movie.count({
      where: {
        movie_name: {
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

  async getMovieListPageByDay(props) {
    let { keyword, page, quantity, startDay, endDate } = props;
    let count = await this.prisma.movie.count({
      where: {
        movie_name: {
          contains: keyword,
        },
        release_date: {
          gte: utcTime(startDay),
          lte: utcTime(endDate),
        },
      },
    });
    // var parts = startDay.split('/');
    // var year = parseInt(parts[0], 10);
    // var month = parseInt(parts[1], 10) - 1; // months are 0-indexed in JavaScript
    // var day = parseInt(parts[2], 10);
    // let inputDay =  new Date(Date.UTC(year, month, day));
    let totalPage = Math.ceil(count / Number(quantity));
    let index = (Number(page) - 1) * Number(quantity);
    let data = await this.prisma.movie.findMany({
      where: {
        movie_name: {
          contains: keyword,
        },
        release_date: {
          gte: utcTime(startDay),
          lte: utcTime(endDate),
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
