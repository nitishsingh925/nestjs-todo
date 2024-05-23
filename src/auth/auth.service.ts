import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { loginDto } from './dto/login.auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(loginDto: loginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
