import { Body, Controller, Get, Head, HttpStatus, NotFoundException, Post, Put, Query, Request, Res, Response, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordRequestResetDto } from 'src/account/dtos/password-request-reset.dto';
import { RegistrationDto } from 'src/account/dtos/register.dto';
import { RegistrationResult } from 'src/account/dtos/registration-result.dto';
import { UpdateProfileDto } from 'src/account/dtos/update-profile.dto';
import { AccountService } from 'src/account/services/account.service';
import { JwtAuthenticationGuard } from 'src/auth/guards/jwt-authentication.guard';
import { ResponseMessage } from 'src/core/models/response-message.model';

@Controller('account')
@ApiTags("Accounts")
export class AccountController {
    constructor(
        private readonly _accountService: AccountService,
    ){}

    @Get('details')
    @UseGuards(JwtAuthenticationGuard)
    public async getAccountDetails(@Request() req): Promise<any> {
      const accountId: number = +req.user.accountId;  
      return this._accountService.getAccountDetails(accountId);
    }

    @Put('profile')
    @UseGuards(JwtAuthenticationGuard)
    public async updateAccountProfile(
        @Request() req, 
        @Body() updateProfileDto: UpdateProfileDto): Promise<any> {
      const accountId: number = +req.user.accountId;
      return this._accountService.updateAccountProfile(accountId, updateProfileDto);
    }

    @Get('profile')
    @UseGuards(JwtAuthenticationGuard)
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


    @Post('password-request')
    public async passwordResetRequest(
        @Body() passwordRequestDto: PasswordRequestResetDto): Promise<ResponseMessage> {
      return this._accountService.passwordRequestReset(passwordRequestDto.email);
    }


    @Head('validate/email')
    public async validateEmail(
        @Request() req, 
        @Response() res, 
        @Query('email') email: string): Promise<void> {
      if (!await this._accountService.doesEmailExist(email)) {
        throw new NotFoundException(`Email, ${email}, doesn't exist`);
      }
      return res.status(204).send();
    }
  
    @Head('validate/username')
    public async validateUsername(
        @Request() req,
        @Response() res,
        @Query('username') username: string): Promise<void> {
      if (!await this._accountService.doesUsernameExist(username)) {
        throw new NotFoundException(`Username, ${username}, doesn't exist`);
      }
      return res.status(204).send();
    }

}
