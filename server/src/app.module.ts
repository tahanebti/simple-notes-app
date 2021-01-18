import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { LoggerModule } from './logger/logger.module';
import { PlansModule } from './plans/plans.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'nestngdb',
      username: 'root',
      password: 'taha@123',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule,
    AccountModule,
    LoggerModule,
    PlansModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
