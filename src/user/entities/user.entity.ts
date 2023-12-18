import { ApiProperty } from "@nestjs/swagger";

export class UserLogin{
  @ApiProperty()
  email: string;
  @ApiProperty()
  pass_word: string;
}
export class UserRegis extends UserLogin {
  @ApiProperty()
  user_name: string;
  @ApiProperty()
  phone_number: string;
  @ApiProperty()
  full_name:string;
}
export class UpdateInfo{
  @ApiProperty()
  email: string;
  @ApiProperty()
  user_name: string;
  @ApiProperty()
  phone_number: string;
  @ApiProperty()
  full_name:string;
}

export class UpdateInfoAdmin extends UserRegis{
  @ApiProperty()
  user_type:string
}