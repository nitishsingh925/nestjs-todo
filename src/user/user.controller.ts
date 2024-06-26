import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async create(
    @Request() request,
    @Response() response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const userEmail = request.body.email;

    const existingUser = await this.userService.findUserByEmail(userEmail);

    if (existingUser) throw new ConflictException('User already exists.');

    const newUser = await this.userService.create(createUserDto);
    return response.status(201).send(newUser);
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Return all users.',
    type: CreateUserDto,
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' }) // Describing the URL parameter
  @ApiResponse({
    status: 200,
    description: 'Return the user with the given ID.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @ApiSecurity('accessToken')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
