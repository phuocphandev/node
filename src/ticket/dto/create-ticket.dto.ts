import { ApiProperty } from "@nestjs/swagger";

class Ticket{
    @ApiProperty()
    chair_id: string
    @ApiProperty()
    price:string
}

export class CreateTicketDto {
    @ApiProperty()
    schedule_id:string
    @ApiProperty({type:[Ticket]})
    chairList: Ticket[]
}

