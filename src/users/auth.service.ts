import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // it returns [] if the user is new
    const existingUser = await this.userService.find(email);
    if (existingUser.length > 0) {
      throw new BadRequestException('User already exists');
    }
    return this.userService.create(email, password);
  }

  async login(email: string, password: string) {
    // find user and check password
    const [user] = await this.userService.find(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new NotFoundException('Invalid credentials');
    }
    return user;
  }
}
