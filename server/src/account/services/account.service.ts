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
import { UpdateAccountDto } from '../dtos/update-account.dto';
import { AccountNotFoundException } from '../exceptions/account-not-found.exception';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { ResponseStatus } from 'src/core/enums/response-status.enum';
import { ResponseMessage } from 'src/core/models/response-message.model';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)private readonly _accountRepository: Repository<Account>,
        @InjectRepository(Address)private readonly _addressRepository: Repository<Address>,
        @InjectRepository(Profile) private readonly _profileRepository: Repository<Profile>,
        @InjectRepository(Role) private readonly _roleRepository: Repository<Role>,
        @InjectRepository(User) private readonly _userRepository: Repository<User>,
    ){}

    public async getAccountDetails(accountId: number): Promise<Partial<Account>> {
      const account: Account = await this._accountRepository.findOne({
        relations: ['plan'],
        where: { id: accountId }
      });
      const { comfirmationToken, ...result } = account;
      return result;
    }

    public async updateAccountDetails(accountId: number, updateAccountDto: UpdateAccountDto): Promise<Account> {
      const account: Account = await this._accountRepository.findOne(accountId);
      if (!account) throw new AccountNotFoundException();
      account.plan = updateAccountDto.plan;
      const { comfirmationToken, ...result } = await this._accountRepository.save(account);
      return result as Account;
    }

    public async getAccountProfile(accountId: number): Promise<Profile> {
        return this._profileRepository.findOne({
          relations: ['address'],
          where: { account: { id: accountId } }
        });
    }

    public async updateAccountProfile(accountId: number, updateProfileDto: UpdateProfileDto): Promise<Profile> {
      const profile: Profile = await this._profileRepository.findOne({ 
        relations: ['address'],
        where: { account: { id: accountId } }
      });
      profile.firstName = updateProfileDto.firstName;
      profile.lastName = updateProfileDto.lastName;
      profile.address.street = updateProfileDto.address.street;
      profile.address.street2 = updateProfileDto.address.street2;
      profile.address.city = updateProfileDto.address.city ;
      profile.address.state = updateProfileDto.address.state;
      profile.address.zip = updateProfileDto.address.zip;
      this._profileRepository.save(profile);
      this._addressRepository.save(profile.address);
      return profile;
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


      public async passwordRequestReset(email: string): Promise<ResponseMessage> {
        const profile: Profile = await this._profileRepository.findOne({ 
          relations: ['account'],
          where: { email: email } 
        });
    
        if (profile) {
          const user: User = await this._userRepository.findOne({ account: { id: profile.account.id } });
          user.resetToken = uuidv4();
          user.resetTokenExpiration = this._generateResetTokenExpiration();
          this._userRepository.save(user);
        //  this._emailerService.sendPasswordResetEmail(email, user.resetToken);
        }
    
        return {
          status: ResponseStatus.SUCCESS,
          message: `You should receive an email with a reset link shortly!`
        } as ResponseMessage
      }
    
      public async doesEmailExist(email: string): Promise<boolean> {
        return this._profileRepository.count({ where: { email: email.trim().toLowerCase() }})
          .then(count => count > 0);
      }
    
      public async doesUsernameExist(username: string): Promise<boolean> {
        return this._userRepository.count({ where: { username: username.trim().toLowerCase() }})
          .then(count => count > 0);
      }
    


      

}
