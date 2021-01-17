import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  
  @ApiProperty() @IsNotEmpty()
  public username: string;

  @ApiProperty() @IsNotEmpty()
  public password: string;

  @ApiProperty() @IsNotEmpty()
  public passwordConfirm: string;
}