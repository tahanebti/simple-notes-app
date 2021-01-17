import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/users/role.entity';
import { User } from 'src/users/user.entity';
import { Account } from './entities/account.entity';
import { Address } from './entities/address.entity';
import { Profile } from './entities/profile.entity';
import { AccountService } from './services/account.service';
import { AccountController } from './controllers/account/account.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Address,
      Profile,
      Role,
      //StripeCustomer,
      User,
      //KeyboardShortcut,
      //KeyboardShortcutAction
    ])
  ],
  controllers: [ AccountController],
  providers: [AccountService]
})
export class AccountModule {}
