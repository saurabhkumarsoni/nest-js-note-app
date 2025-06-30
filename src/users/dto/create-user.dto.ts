import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MaxLength,
  MinLength,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() zip: string;
  @IsString() country: string;
}

class ProjectDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsString() techStack: string;
}

class EducationDto {
  @IsString() degree: string;
  @IsString() university: string;
  @IsOptional()
  yearOfPassing: number;
}

export class CreateUserDto {
  @IsString() @MinLength(3) @MaxLength(100) firstName: string;
  @IsString() @MinLength(3) @MaxLength(100) lastName: string;

  @IsEmail() @MaxLength(100) email: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() profileImage?: string;
  @IsOptional() @IsString() dateOfBirth?: string;
  @IsOptional() @IsString() dateOfJoining?: string;
  @IsOptional() @IsString() gender?: string;

  @IsOptional() @IsString() position?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() employeeId?: string;
  @IsOptional() @IsString() reportingManager?: string;
  @IsOptional() @IsString() experience?: string;

  @IsBoolean() isMarried: boolean;

  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() github?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsString() @MinLength(6) @MaxLength(200) password: string;
}
