import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshGuard } from './jwt-refresh.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    validateUser: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockTokens = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtRefreshGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        isMarried: false,
      };

      const expectedResult = {
        message: 'User registered successfully',
        user: mockUser,
      };

      mockAuthService.signup.mockResolvedValue(expectedResult);

      const result = await controller.signup(createUserDto);

      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle signup errors', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        isMarried: false,
      };

      mockAuthService.signup.mockRejectedValue(
        new Error('Email already exists'),
      );

      await expect(controller.signup(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(authService.signup).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockTokens);
    });

    it('should handle invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
        headers: {
          authorization: 'Bearer mock-refresh-token',
        },
      };

      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(newTokens);

      const result = await controller.refresh(mockRequest);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockUser.id,
        'mock-refresh-token',
      );
      expect(result).toEqual(newTokens);
    });

    it('should handle invalid refresh token', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      mockAuthService.refreshTokens.mockRejectedValue(
        new ForbiddenException('Invalid refresh token'),
      );

      await expect(controller.refresh(mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockRequest = {
        user: mockUser,
      };

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens successfully', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
        headers: {
          authorization: 'Bearer mock-refresh-token',
        },
      };

      const newTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(newTokens);

      const result = await controller.refresh(mockRequest);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockUser.id,
        'mock-refresh-token',
      );
      expect(result).toEqual(newTokens);
    });

    it('should handle invalid refresh token', async () => {
      const mockRequest = {
        user: { id: mockUser.id },
        headers: {
          authorization: 'Bearer invalid-token',
        },
      };

      mockAuthService.refreshTokens.mockRejectedValue(
        new ForbiddenException('Invalid refresh token'),
      );

      await expect(controller.refresh(mockRequest)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
