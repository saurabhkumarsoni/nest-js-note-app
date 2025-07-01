import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Create a new user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepo.create(createUserDto);
    return this.userRepo.save(newUser);
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  /**
   * Get a user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }
    return user;
  }

  /**
   * Get user by ID and return plain object (excluding @Exclude() fields)
   */
  async getUserByIdAsPlain(id: string): Promise<any> {
    const user = await this.getUserById(id);
    return instanceToPlain(user);
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, updateDto);
    return this.userRepo.save(updatedUser);
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id "${id}" not found.`);
    }
    return { message: `User with id "${id}" has been deleted.` };
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  /**
   * Update refresh token (hashed)
   */
  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(userId, { hashedRefreshToken: hashedToken });
  }

  /**
   * Remove refresh token from user
   */
  async removeRefreshToken(userId: number): Promise<void> {
    await this.userRepo.update(userId, { hashedRefreshToken: null });
  }
}
