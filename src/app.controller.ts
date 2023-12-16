import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Controller("user")
export class AppController {
  constructor(private readonly appService: AppService) {}

}
