import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  Req,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put(':id/upload')
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
    console.log('📸 Uploaded file:', file); // 👈 add this line

    if (!file) {
      throw new Error('No file uploaded');
    }

    const imageUrl = `http://localhost:3000/uploads/profile-images/${file.filename}`;
    return this.usersService.updateUser(id, { profileImage: imageUrl });
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id') // ✅ this was missing
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update user by ID' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
