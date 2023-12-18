import { Module } from '@nestjs/common';
import { TheaterService } from './theater.service';
import { TheaterController } from './theater.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TheaterController],
  providers: [TheaterService,JwtService,PrismaService],
})
export class TheaterModule {}
