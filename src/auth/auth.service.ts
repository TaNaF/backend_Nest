import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.student_password === password) {
      const { student_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    return {
      user_profile: user,
      access_token: this.jwtService.sign(user),
    };
  }
}