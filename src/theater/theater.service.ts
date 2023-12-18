import { Injectable } from '@nestjs/common';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TheaterService {
  constructor(private prisma: PrismaService) {}

  async getTheaterSystem(id: string) {
    let data = undefined;
    if (id) {
      data = await this.prisma.theater_system.findUnique({
        where: { theater_system_id: Number(id) },
      });
    } else {
      data = await this.prisma.theater_system.findMany();
    }
    return data;
  }

  async getTheaterGroupBySystem(id: string) {
    let data = undefined;
    if (id) {
      data = await this.prisma.theater_system.findMany({
        where: { theater_system_id: Number(id) },
        include: { theater_group: true },
      });
    } else {
      data = await this.prisma.theater_system.findMany({
        include: { theater_group: true },
      });
    }
    return data;
  }

  async getScheduleBySystem(id: string) {
    let data = undefined;
    if (id) {
      data = await this.prisma.theater_system.findMany({
        where: { theater_system_id: Number(id) },
        include: {
          theater_group: {
            include: { theater: { include: { schedule: true } } },
          },
        },
      });
    } else {
      data = await this.prisma.theater_system.findMany({
        include: {
          theater_group: {
            include: { theater: { include: { schedule: true } } },
          },
        },
      });
    }
    return data;
  }
}
