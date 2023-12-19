import { ApiProperty } from '@nestjs/swagger';

class Ticket {
  @ApiProperty()
  chair_id: string;
  @ApiProperty()
  price: string;
}

export class CreateTicketDto {
  @ApiProperty()
  schedule_id: string;
  @ApiProperty({ type: [Ticket] })
  chairList: Ticket[];
}

export class CreateScheduleDto {
  @ApiProperty()
  movie_id: string;
  @ApiProperty({ description: 'YYYY/MM/DD' })
  schedule_time: string;
  @ApiProperty()
  theater_id: string;
  @ApiProperty()
  price: string;
}
