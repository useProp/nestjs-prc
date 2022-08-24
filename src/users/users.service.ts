import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { BanUserDto } from './dto/ban-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private readonly roleService: RolesService,
  ) {}

  public async createUser(data: CreateUserDto): Promise<User> {
    try {
      const candidate = await this.getUserByEmail(data.email);
      if (candidate) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }

      const user = await this.userRepository.create(data);
      const role = await this.roleService.getRoleByValue('ADMIN');
      await user.$set('roles', [role.id]);
      user.roles = [role];

      return user;
    } catch (e) {
      const message = `Server error: ${e?.message || 'Creating user'}`;
      const status = e?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  public async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll({ include: { all: true } });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
  }

  public async addRole(dto: AddRoleDto): Promise<User> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const role = await this.roleService.getRoleByValue(dto.value);
    if (!role) {
      throw new NotFoundException({ message: 'Role not found' });
    }

    await user.$add('roles', role);

    return user;
  }

  public async banUser(dto: BanUserDto): Promise<User> {
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    user.banned = true;
    user.banReason = dto.banReason;
    await user.save();

    return user;
  }
}
