import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize-interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
// we use it to hide password
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/logout')
  logout(@Session() session: any) {
    session.userId = null;
    return { message: 'Logged out successfully' };
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoami(@CurrentUser() user: User) {
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    return await this.userService.find(email);
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.userService.update(+id, body);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
