import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { TicketModule } from './ticket/ticket.module';
import { TheaterModule } from './theater/theater.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, MovieModule, TicketModule, TheaterModule,ConfigModule.forRoot({isGlobal:true})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
