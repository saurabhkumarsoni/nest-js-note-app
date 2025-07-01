import {
  Body,
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Upload a new profile image for a user
   * Endpoint: PUT /api/users/:id/upload
   */
  @Put(':id/upload')
  @ApiOperation({ summary: 'Upload profile image for user' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    if (!file) {
      throw new Error('No file uploaded');
    }

    const imageUrl = `http://localhost:3000/uploads/profile-images/${file.filename}`;

    return this.usersService.updateUser(id, {
      profileImage: imageUrl,
    });
  }

  /**
   * Get all users
   * Endpoint: GET /api/users
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * Get user by ID
   * Endpoint: GET /api/users/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  /**
   * Update user by ID
   * Endpoint: PUT /api/users/:id
   */
  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user by ID' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * Delete user by ID
   * Endpoint: DELETE /api/users/:id
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
