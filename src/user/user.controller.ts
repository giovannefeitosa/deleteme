import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/login/success')
  @UseGuards(JwtAuthGuard, RolesGuard)
  public loginSuccess(): string {
    return 'Login success';
  }

  @Get('/login/failure')
  public loginFailure(): string {
    throw new NotFoundException('Login failure');
  }

  @Get('/:username')
  async getByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.userService.findOneByUsername(username);
    if (user) return user;
    throw new NotFoundException();
  }
}
