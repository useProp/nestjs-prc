import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './role.model';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleService: RolesService) {}

  @Get('/:value')
  async getRoleByValue(@Param('value') value: string): Promise<Role> {
    return this.roleService.getRoleByValue(value);
  }

  @Post()
  async createRole(@Body() dto: CreateRoleDto): Promise<Role | string> {
    return this.roleService.createRole(dto);
  }
}
