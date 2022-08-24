import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role } from './role.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
  ) {}

  public async createRole(dto: CreateRoleDto): Promise<Role | string> {
    try {
      const { value } = dto;

      const existingRole = await this.roleRepository.findOne({
        where: { value },
      });
      if (existingRole) {
        throw new HttpException('Role already exists', HttpStatus.CONFLICT);
      }

      return await this.roleRepository.create(dto);
    } catch (e) {
      const message = `Server error: ${e?.message || 'Creating user'}`;
      const status = e?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException(message, status);
    }
  }

  public async getRoleByValue(value: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { value } });
  }
}
