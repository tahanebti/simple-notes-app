import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Plan } from "src/plans/entities/plan.entity";

export class CreateAccountDto {
    @ApiProperty() @IsNotEmpty()
    public plan: Plan;
  }