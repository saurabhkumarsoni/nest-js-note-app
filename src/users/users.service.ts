import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);
    const savedUser = await this.userRepo.save(user);
    return savedUser; // ✅ must include 'id'
  }

  async updateUser(id: number, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);
    const updatedUser = Object.assign(user, updateDto);
    return this.userRepo.save(updatedUser);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { message: `User with id ${id} has been deleted.` };
  }
}
