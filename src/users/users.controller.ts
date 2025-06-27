import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // GET api/users
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getUsers() {
    return this.usersService.getAllUsers();
  }

  // GET api/users/:id
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  // PATCH api/users/:id
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  updateUser(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  // DELETE api/users/:id
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
