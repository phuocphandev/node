import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  UploadedFile,
  UseInterceptors,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { UploadMovieDto } from './dto/upload-movie.dto';
import { ApiBody, ApiConsumes, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import slugify from 'slugify';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@ApiTags('Movie management')
@Controller('api/movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @HttpCode(200)
  @Get('/get-banner')
  getBanner() {
    return this.movieService.getBanner();
  }

  @HttpCode(200)
  @ApiQuery({
    name: 'keyword',
    required: false,
  })
  @Get('/get-movie-list')
  getMovieList(@Query('keyword') keyword: string) {
    return this.movieService.getMovieList(keyword);
  }

  @HttpCode(200)
  @ApiQuery({
    name: 'keyword',
    required: false,
  })
  @Post('/get-movie-list-page')
  getUserListPage(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('quantity') quantity: string,
  ) {
    let props = { keyword, page, quantity };
    return this.movieService.getMovieListPage(props);
  }

  @HttpCode(200)
  @ApiQuery({
    name: 'keyword',
    required: false,
  })
  @ApiQuery({
    name: 'start',
    description: 'YYYY/MM/DD',
  })
  @ApiQuery({
    name: 'end',
    description: 'YYYY/MM/DD',
  })
  @Post('/get-movie-list-page-by-day')
  getUserListPageByDay(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('quantity') quantity: string,
    @Query('start') startDay: string,
    @Query('end') endDate: string,
  ) {
    let props = { keyword, page, quantity, startDay, endDate };
    return this.movieService.getMovieListPageByDay(props);
  }

  @HttpCode(201)
  @ApiBody({ type: UploadMovieDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/imgs',
        filename: (req, file, callback) =>
          callback(
            null,
            new Date().getTime() +
              '_' +
              slugify(file.originalname, {
                replacement: '_',
                lower: true,
                locale: 'vi',
              }),
          ),
      }),
    }),
  )
  @Post('/add-movie-thumbnail')
  addMovieThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
  ) {
    return this.movieService.addMovieThumbnail({ file, body });
  }

  @HttpCode(200)
  @ApiBody({ type: UploadMovieDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.cwd() + '/public/imgs',
        filename: (req, file, callback) =>
          callback(
            null,
            new Date().getTime() +
              '_' +
              slugify(file.originalname, {
                replacement: '_',
                lower: true,
                locale: 'vi',
              }),
          ),
      }),
    }),
  )
  @Put('/update-movie-thumbnail')
  updateMovieThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Query('moviename') moviename: string,
  ) {
    return this.movieService.updateMovieThumbnail({ file, body, moviename });
  }

  @ApiSecurity('token')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete-movie')
  deleteMovie(@Query('id') id:string, @Req() req:Request){
    let tokenDecode = req.user;
    return this.movieService.deleteMovie({id,tokenDecode})
  }

  @HttpCode(200)
  @Get('/get-movie-info')
  getMovieInfo(@Query('id') id:string){
    return this.movieService.getMovieInfo(id)
  }


}
