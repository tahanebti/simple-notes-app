import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateAccountDto } from "./create-account.dto";
import { CreateProfileDto } from "./create-profile.dto";
import { CreateUserDto } from "./create-user.dto";

export class RegistrationDto {
    @ApiProperty() @IsNotEmpty()
    public account: CreateAccountDto;
  
    @ApiProperty() @IsNotEmpty()
    public profile: CreateProfileDto;
    
    @ApiProperty() @IsNotEmpty()
    public user: CreateUserDto;
}