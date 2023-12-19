import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as moment from 'moment';
import * as fs from 'fs'

export function utcTime(arg: string) {
  let inputDay = moment.utc(arg, 'YYYY-MM-DD');
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

  async addMovieThumbnail({ file, body }) {
    let {
      movie_name,
      trailer,
      description,
      release_date,
      rate,
      hot,
      showing,
      upcoming,
    } = body;
    let data = {
      ...body,
      thumbnail: file.filename,
      release_date: utcTime(release_date),
      rate: Number(rate),
      showing: showing == 'true' ? true : false,
      hot: hot == 'true' ? true : false,
      upcoming: upcoming == 'true' ? true : false,
    };
    await this.prisma.movie.create({ data });
    return 'Movie was created successfully!';
  }

  async updateMovieThumbnail({ file, body, moviename }) {
    let {
      movie_name,
      trailer,
      description,
      release_date,
      rate,
      hot,
      showing,
      upcoming,
    } = body;
    let movie = await this.prisma.movie.findMany({
      where: { movie_name: { contains: moviename } },
    });
    if (movie.length > 1) {
      throw new BadRequestException("Please input movie's name completely!");
    } else if (movie.length == 0) {
      fs.unlink(process.cwd()+"/public/imgs/"+file.filename,()=>{})
      throw new BadRequestException('There are no movie names like that!');
    } else {
      let data = {
        ...body,
        thumbnail: file.filename,
        release_date: utcTime(release_date),
        rate: Number(rate),
        showing: showing == 'true' ? true : false,
        hot: hot == 'true' ? true : false,
        upcoming: upcoming == 'true' ? true : false,
      };
      await this.prisma.movie.update({
        data: data,
        where: { movie_id: movie[0].movie_id },
      });
      return 'Movie was update successfully!';
    }
  }

  async deleteMovie({ id, tokenDecode }) {
    let { user_type } = tokenDecode;
    if (user_type == 'user') {
      throw new UnauthorizedException("You don't have valid role!");
    } else {
      await this.prisma.movie.delete({ where: { movie_id: Number(id) } });
      return 'Movie was deleted!';
    }
  }

  async getMovieInfo(id: string) {
    let data = await this.prisma.movie.findUnique({
      where: { movie_id: Number(id) },
    });
    return data;
  }
}
