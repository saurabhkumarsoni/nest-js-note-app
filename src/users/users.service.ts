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
    private userRepo: Repository<User>,
  ) {}

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(userId, { hashedRefreshToken: hashedToken });
  }

  async removeRefreshToken(userId: number) {
    await this.userRepo.update(userId, { hashedRefreshToken: null });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getUserById(id: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return instanceToPlain(user); // this removes @Exclude() fields
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    return await this.userRepo.save(user);
  }

  async updateUser(id: string, updateDto: UpdateUserDto): Promise<User> {
    console.log(UpdateUserDto);
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, updateDto);
    return this.userRepo.save(updatedUser);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: `User with id ${id} has been deleted.` };
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
