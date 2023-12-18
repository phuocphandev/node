import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiTags('Theater management')
@Controller('api/theater')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}

  @HttpCode(200)
  @ApiQuery({
    name:'theater-system',
    required:false
  })
  @Post('/get-theater-system')
  getTheaterSystem(@Query('theater-system') id:string){
    return this.theaterService.getTheaterSystem(id);
  }
  
  @HttpCode(200)
  @ApiQuery({
    name:'theater-system',
    required:false
  })
  @Post('/get-theater-group-by-system')
  getTheaterGroupBySystem(@Query('theater-system') id:string){
    return this.theaterService.getTheaterGroupBySystem(id);
  }

  @HttpCode(200)
  @ApiQuery({
    name:'theater-system',
    required:false
  })
  @Post('/get-schedule-by-system')
  getScheduleBySystem(@Query('theater-system') id:string){
    return this.theaterService.getScheduleBySystem(id);
  }


}
