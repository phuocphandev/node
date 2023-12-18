import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags("Movie management")
@Controller('api/movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}
 
@HttpCode(200)
@Get('/get-banner')
getBanner(){
 return this.movieService.getBanner();
}

@HttpCode(200)
@ApiQuery({
  name:'keyword',
  required:false
})
@Get('/get-movie-list')
getMovieList(@Query('keyword') keyword:string){
  return this.movieService.getMovieList(keyword);
}

@HttpCode(200)
@ApiQuery({
  name:'keyword',
  required:false
})
@Post('/get-movie-list-page')
  getUserListPage(@Query('keyword') keyword:string, @Query('page') page:string, @Query('quantity') quantity:string){
    let props={keyword,page,quantity}
    return this.movieService.getMovieListPage(props);
  }

@HttpCode(200)
@ApiQuery({
  name:'keyword',
  required:false, 
})
@Post('/get-movie-list-page-by-day')
  getUserListPageByDay(@Query('keyword') keyword:string, @Query('page') page:string, @Query('quantity') quantity:string, @Query('start') startDay: string, @Query('end') endDate:string){
    let props={keyword,page,quantity,startDay,endDate}
    return this.movieService.getMovieListPageByDay(props);
  }
}
