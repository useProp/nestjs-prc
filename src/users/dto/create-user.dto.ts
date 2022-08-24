import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com', description: 'Email' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email field must be a correct email address' })
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'Password' })
  @IsString({ message: 'Password must be a string' })
  @Length(4, 16, { message: 'Password must be in range 4 - 16 chars' })
  readonly password: string;
}
