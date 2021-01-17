import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) { }

    async getUsers(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async getUser(userId): Promise<User> {
        const user = await this.usersRepository.findOne(userId);
        return user;
    }

    async createUser(userDto: UserDto): Promise<User> {
        return await this.usersRepository.save(userDto);
    }

    async updateUser(user: User) {
        this.usersRepository.save(user)
    }

    async deleteUser(user: User) {
        this.usersRepository.delete(user);
    }


    public async findByUsername(username: string): Promise<User | undefined> {
        return (await this.usersRepository.find({
          //relations: ['roles', 'account'],
          where: { username: username },
          take: 1
        }))[0];
      }

}
