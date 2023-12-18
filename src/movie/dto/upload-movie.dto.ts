import { ApiProperty } from "@nestjs/swagger";

export class UploadMovieDto {
    @ApiProperty({type:String, format:'binary'})
    file: any
    @ApiProperty()
    movie_name:string
    @ApiProperty()
    trailer:string
    @ApiProperty()
    description:string
    @ApiProperty({description:"YYYY/MM/DD"})
    release_date:string
    @ApiProperty()
    rate:string
    @ApiProperty({description:"True or False"})
    hot:boolean
    @ApiProperty({description:"True or False"})
    showing:boolean
    @ApiProperty({description:"True or False"})
    upcoming:boolean
}

