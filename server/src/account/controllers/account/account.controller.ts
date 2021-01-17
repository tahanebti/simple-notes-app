import { Body, Controller, Get, HttpStatus, Post, Request, Res, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegistrationDto } from 'src/account/dtos/register.dto';
import { RegistrationResult } from 'src/account/dtos/registration-result.dto';
import { AccountService } from 'src/account/services/account.service';

@Controller('account')
@ApiTags("Accounts")
export class AccountController {
    constructor(
        private readonly _accountService: AccountService,
    ){}

    @Get('profile')
   // @UseGuards(JwtAuthenticationGuard)
    public async getAccountProfile(@Request() req): Promise<any> {
      const accountId: number = +req.user.accountId;
      return this._accountService.getAccountProfile(accountId);
    }
  
    @ApiResponse({ status: 201 })
    @Post('register')
    public async registerAccount(@Res() res, @Body() registrationDto: RegistrationDto): Promise<RegistrationResult> {
      const result: RegistrationResult = await this._accountService.registerNewAccount(registrationDto);
      return res.status(HttpStatus.CREATED).json({
        status: 201,
        message: "Successful!",
        data: result
    })
    }
}
