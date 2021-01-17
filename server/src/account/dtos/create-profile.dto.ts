import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { CreateAddressDto } from "./create-address.dto";

export class CreateProfileDto {
    @ApiProperty() @IsNotEmpty()
    public firstName: string;
  
    @ApiProperty() @IsNotEmpty()
    public lastName: string;
  
    @ApiProperty() @IsEmail()
    public email: string;
  
    @ApiProperty() @IsNotEmpty()
    public address: CreateAddressDto;
  }