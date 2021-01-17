import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty() @IsNotEmpty()
  public street: string;
 
  @ApiProperty()
  public street2: string;

  @ApiProperty() @IsNotEmpty()
  public city: string

  @ApiProperty() @IsNotEmpty()
  public state: string;

  @ApiProperty() @IsNotEmpty()
  public zip: string;
}
