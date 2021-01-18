import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { RefreshTokenDto } from 'src/auth/dtos/refresh-token.dto';
import { AuthenticatedUser } from 'src/auth/entities/authenticated-user.model';
import { LocalAuthenticationGuard } from 'src/auth/guards/local-authentication.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}


    @UseGuards(LocalAuthenticationGuard)
    @Post('login')
    @HttpCode(200)
    public async login(@Request() req): Promise<AuthenticatedUser> {
      return this.authService.login(req.user);
    }
  
    @Post('token')
    @HttpCode(200)
    public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthenticatedUser> {
      return this.authService.refreshToken(refreshTokenDto.accessToken, refreshTokenDto.refreshToken);
    }

    
}
