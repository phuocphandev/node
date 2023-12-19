import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}
  async booking({ body, tokenDecode }) {
    let { user_id } = tokenDecode;
    let { schedule_id, chairList } = body;
    let checkScheduleId = await this.prisma.ticket.findMany({
      where: { user_id, schedule_id:Number(schedule_id),},
    });

    checkScheduleId.map((e)=>{
      chairList.map((item)=>{if (item.chair_id == e.chair_id){
        throw new BadRequestException(`${item.chair_id} already booked!`)
      }})
    })
    await Promise.all(
    chairList.map(async (item)=>{
      let data = {
        user_id,
        schedule_id: Number(schedule_id),
        chair_id: Number(item.chair_id),
      };
      await this.prisma.ticket.create({data });
    })
    )
    let resData = await this.prisma.ticket.findMany({
      where: { user_id },
      select: { schedule_id: true, chair_id: true },
    });
    console.log(resData)
    return { user_id: user_id, ticket: resData };
  }


}
