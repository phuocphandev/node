import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


@ApiTags('Ticket management')
@Controller('api/ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @HttpCode(201)
  @ApiSecurity('token')
  @UseGuards(AuthGuard('jwt'))
  @Post('/booking')
  booking(@Body() body:CreateTicketDto, @Req() req:Request){
    let tokenDecode = req.user;
    return this.ticketService.booking({body,tokenDecode})
  }
}
