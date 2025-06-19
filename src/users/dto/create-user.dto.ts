import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Max,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First Name should be a string.' })
  @IsNotEmpty()
  @MinLength(3, { message: 'First Name should have at least 3 characters.' })
  @MaxLength(100)
  firstName: string;

  @IsString({ message: 'Last Name should be a string.' })
  @IsNotEmpty()
  @MinLength(3, { message: 'Last Name should have at least 3 characters.' })
  @MaxLength(100)
  lastName: string;

  @IsInt({ message: 'Age must be an integer.' })
  @Min(0)
  @Max(120)
  age: number;

  @IsOptional()
  @IsString({ message: 'Gender must be a string.' })
  @MaxLength(10)
  gender?: string;

  @IsEmail({}, { message: 'Invalid email format.' })
  @MaxLength(100)
  email: string;

  @IsBoolean({ message: 'isMarried must be a boolean.' })
  isMarried: boolean;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @MaxLength(200)
  password: string;
}
