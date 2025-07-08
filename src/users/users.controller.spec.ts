import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Readable } from 'stream';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '+1234567890',
    profileImage: null,
    dateOfBirth: '1990-01-01',
    dateOfJoining: '2023-01-01',
    gender: 'male',
    position: 'Developer',
    department: 'Engineering',
    employeeId: 'EMP001',
    reportingManager: 'Manager Name',
    experience: '5 years',
    isMarried: false,
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
    skills: ['JavaScript', 'TypeScript', 'Node.js'],
    projects: [
      {
        name: 'Project 1',
        description: 'Description 1',
        techStack: 'React, Node.js',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        university: 'University Name',
        yearOfPassing: 2020,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'profile.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    destination: './uploads/profile-images',
    filename: '1234567890-profile.jpg',
    path: './uploads/profile-images/1234567890-profile.jpg',
    buffer: Buffer.from(''),
    stream: new Readable(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadProfileImage', () => {
    it('should upload profile image successfully', async () => {
      const updatedUser = {
        ...mockUser,
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.uploadProfileImage(mockFile, mockUser.id);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, {
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when no file is uploaded', async () => {
      await expect(
        controller.uploadProfileImage(undefined as any, mockUser.id),
      ).rejects.toThrow('No file uploaded');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(mockUser.id);

      expect(usersService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockUsersService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById('non-existent-id');

      expect(usersService.getUserById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should update user with complex data', async () => {
      const updateUserDto: UpdateUserDto = {
        address: {
          street: '456 Oak St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          country: 'USA',
        },
        skills: ['React', 'Vue.js', 'Angular'],
        projects: [
          {
            name: 'New Project',
            description: 'New project description',
            techStack: 'Vue.js, Express',
          },
        ],
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const deleteResult = { message: 'User deleted successfully' };
      mockUsersService.deleteUser.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser(mockUser.id);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(deleteResult);
    });

    it('should handle delete user error', async () => {
      mockUsersService.deleteUser.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.deleteUser('non-existent-id')).rejects.toThrow(
        'User not found',
      );
      expect(usersService.deleteUser).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('uploadProfileImage', () => {
    it('should upload profile image successfully', async () => {
      const updatedUser = {
        ...mockUser,
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.uploadProfileImage(mockFile, mockUser.id);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, {
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when no file is uploaded', async () => {
      await expect(
        controller.uploadProfileImage(undefined as any, mockUser.id),
      ).rejects.toThrow('No file uploaded');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(mockUser.id);

      expect(usersService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockUsersService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById('non-existent-id');

      expect(usersService.getUserById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should update user with complex data', async () => {
      const updateUserDto: UpdateUserDto = {
        address: {
          street: '456 Oak St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          country: 'USA',
        },
        skills: ['React', 'Vue.js', 'Angular'],
        projects: [
          {
            name: 'New Project',
            description: 'New project description',
            techStack: 'Vue.js, Express',
          },
        ],
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const deleteResult = { message: 'User deleted successfully' };
      mockUsersService.deleteUser.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser(mockUser.id);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(deleteResult);
    });

    it('should handle delete user error', async () => {
      mockUsersService.deleteUser.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.deleteUser('non-existent-id')).rejects.toThrow(
        'User not found',
      );
      expect(usersService.deleteUser).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('uploadProfileImage', () => {
    it('should upload profile image successfully', async () => {
      const updatedUser = {
        ...mockUser,
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.uploadProfileImage(mockFile, mockUser.id);

      expect(usersService.updateUser).toHaveBeenCalledWith(mockUser.id, {
        profileImage:
          'http://localhost:3000/uploads/profile-images/1234567890-profile.jpg',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when no file is uploaded', async () => {
      await expect(
        controller.uploadProfileImage(undefined as any, mockUser.id),
      ).rejects.toThrow('No file uploaded');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUsersService.getAllUsers.mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(usersService.getAllUsers).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      mockUsersService.getUserById.mockResolvedValue(mockUser);

      const result = await controller.getUserById(mockUser.id);

      expect(usersService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it('should handle user not found', async () => {
      mockUsersService.getUserById.mockResolvedValue(null);

      const result = await controller.getUserById('non-existent-id');

      expect(usersService.getUserById).toHaveBeenCalledWith('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+0987654321',
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should update user with complex data', async () => {
      const updateUserDto: UpdateUserDto = {
        address: {
          street: '456 Oak St',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90210',
          country: 'USA',
        },
        skills: ['React', 'Vue.js', 'Angular'],
        projects: [
          {
            name: 'New Project',
            description: 'New project description',
            techStack: 'Vue.js, Express',
          },
        ],
      };

      const updatedUser = { ...mockUser, ...updateUserDto };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.updateUser(mockUser.id, updateUserDto);

      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUser.id,
        updateUserDto,
      );
      expect(result).toEqual(updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const deleteResult = { message: 'User deleted successfully' };
      mockUsersService.deleteUser.mockResolvedValue(deleteResult);

      const result = await controller.deleteUser(mockUser.id);

      expect(usersService.deleteUser).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(deleteResult);
    });

    it('should handle delete user error', async () => {
      mockUsersService.deleteUser.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(controller.deleteUser('non-existent-id')).rejects.toThrow(
        'User not found',
      );
      expect(usersService.deleteUser).toHaveBeenCalledWith('non-existent-id');
    });
  });
});
