import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { AuthService } from './services/auth/auth.service';
import { RefreshTokenService } from './services/refresh-token/refresh-token.service';
import { AuthController } from './controllers/auth/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from './constants';
import { RefreshToken } from './entities/refresh-token.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IAuthModuleOptions, PassportModule } from '@nestjs/passport';

const passportModuleOptions: IAuthModuleOptions = { defaultStrategy: 'jwt' };
const jwtModuleOptions: JwtModuleOptions = {
  secret: jwtConstants.secret,
  signOptions: { expiresIn: '1h' }
}

@Module({
  imports: [
    UsersModule,
    PassportModule.register(passportModuleOptions),
    JwtModule.register(jwtModuleOptions),
    TypeOrmModule.forFeature([RefreshToken])
  ],
  providers: [
    AuthService, 
    RefreshTokenService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    AuthService
  ],
  controllers: [AuthController]
})
export class AuthModule {}
