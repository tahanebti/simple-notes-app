import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/users/enums/role-type.enum';
import { Role } from 'src/users/role.entity';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { RegistrationDto } from '../dtos/register.dto';
import { Account } from '../entities/account.entity';
import { Address } from '../entities/address.entity';
import { Profile } from '../entities/profile.entity';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { CreateAddressDto } from '../dtos/create-address.dto';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)private readonly _accountRepository: Repository<Account>,
        @InjectRepository(Address)private readonly _addressRepository: Repository<Address>,
        @InjectRepository(Profile) private readonly _profileRepository: Repository<Profile>,
        @InjectRepository(Role) private readonly _roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
    ){}

    public async getAccountProfile(accountId: number): Promise<Profile> {
        return this._profileRepository.findOne({
          relations: ['address'],
          where: { account: { id: accountId } }
        });
    }


    public async registerNewAccount(registrationDto: RegistrationDto): Promise<any> {
        const account: Account = await this._createNewAccount(registrationDto.account);
        const user: User = await this._createNewUser(registrationDto.user, account);
        const profile: Profile = await this._createNewProfile(registrationDto.profile, account);
    }     


    _createNewAccount(createAccountDto: CreateAccountDto): Promise<Account> {
        const account: Account = this._accountRepository.create({
        plan: createAccountDto.plan
        });
        return this._accountRepository.save(account);
    }

    private async _createNewUser(createUserDto: CreateUserDto, account: Account): Promise<User> {
        const userRole: Role = await this._roleRepository.findOne({ name: RoleType.USER });
        const resetTokenExpiration: Date = this._generateResetTokenExpiration();
        const user: User = this._userRepository.create({
          username: createUserDto.username.trim().toLowerCase(),
          password: this._hashPassword(createUserDto.password),
          account: { id: account.id },
          resetToken: uuidv4(),
          resetTokenExpiration: resetTokenExpiration,
          roles: [userRole]
        });  
        return this._userRepository.save(user);
      }


      private _generateResetTokenExpiration(): Date {
        const now: Date = new Date();
        now.setMinutes(now.getMinutes() + 10);
        return now;
      }
    
      private _hashPassword(password: string): string {
        return bcrypt.hashSync(password, 6);
      }


      private async _createNewProfile(createProfileDto: CreateProfileDto, account: Account): Promise<Profile> {
        const address: Address = await this._createNewAddress(createProfileDto.address);
        const profile: Profile = this._profileRepository.create({
          firstName: createProfileDto.firstName,
          lastName: createProfileDto.lastName,
          email: createProfileDto.email.trim().toLowerCase(),
          address: address,
          account: { id: account.id }
        });
        return this._profileRepository.save(profile);
      }


      private async _createNewAddress(createAddressDto: CreateAddressDto): Promise<Address> {
        const address: Address = this._addressRepository.create({
          street: createAddressDto.street,
          street2: createAddressDto.street2,
          city: createAddressDto.city,
          state: createAddressDto.state,
          zip: createAddressDto.zip
        });
        return this._addressRepository.save(address);
      }

}
