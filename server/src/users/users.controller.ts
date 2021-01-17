import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags("Users")
export class UsersController {
    
    constructor(private service: UsersService) { }

    @ApiResponse({ status: 200 })
    @Get('/all')
    async getAllNotes(@Res() res) {
        const users = await this.service.getUsers();
        return res.status(HttpStatus.OK).json({
            status: 200,
            data: users
        })
    }


    @ApiResponse({ status: 200 })
    @Get("/:userId")
    get(@Res() res, @Param("userId") _id: number) {
        return this.service.getUser(_id);
    }

    @ApiResponse({ status: 201 })
    @Post('/add')
    async  create(@Res() res, @Body() user: UserDto) {
        const note = await this.service.createUser(user);
        return res.status(HttpStatus.CREATED).json({
            status: 201,
            message: "Successful!",
            data: note
        })
    }

    @Put()
    update(@Body() user: User) {
        return this.service.updateUser(user);
    }

    @Delete(':id')
    deleteUser(@Param() params) {
        return this.service.deleteUser(params.id);
    }
}
