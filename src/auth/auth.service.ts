import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userToSave = { ...dto, password: hashedPassword };
    const newUser = await this.usersService.createUser(userToSave);

    // Exclude password from response
    const { password, ...result } = newUser;
    return {
      message: 'User registered successfully',
      user: result,
    };
  }

  async login(email: string, plainPassword: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const token = this.jwtService.sign(payload);

    const { password, ...userData } = user;

    return {
      message: 'Login successful',
      user: userData,
      token,
    };
  }
}
