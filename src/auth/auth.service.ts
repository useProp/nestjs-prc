import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async login(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) {
      throw new HttpException('Email is incorrect', HttpStatus.BAD_REQUEST);
    }

    const isPasswordCorrect = await this.comparePasswords(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new HttpException('Password is incorrect', HttpStatus.BAD_REQUEST);
    }

    return this.generateToken(user);
  }

  public async register(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashPassword = await this.hashPassword(dto.password);
    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });



    return this.generateToken(user);
  }

  private generateToken({ email, id, roles }: User): { token: string } {
    const payload = { email, id, roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private async comparePasswords(plain, hash): Promise<boolean> {
    return await bcrypt.compare(plain, hash);
  }
}
