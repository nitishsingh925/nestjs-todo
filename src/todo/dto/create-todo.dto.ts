import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'Title of the todo',
    example: 'Buy groceries',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @ApiProperty({
    description: 'Completion status of the todo',
    example: false,
  })
  @IsBoolean()
  @IsOptional() // Optional because it can default to false in the entity
  completed?: boolean;
}
