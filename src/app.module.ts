import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MovieModule } from './movie/movie.module';
import { TicketModule } from './ticket/ticket.module';
import { TheaterModule } from './theater/theater.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    MovieModule,
    TicketModule,
    TheaterModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ secret: 'MOVIE' }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, JwtStrategy],
})
export class AppModule {}
