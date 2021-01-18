import { IsNotEmpty } from "class-validator";
import { Plan } from "src/plans/entities/plan.entity";

export class UpdateAccountDto {
    @IsNotEmpty()
    public plan: Plan;
  }