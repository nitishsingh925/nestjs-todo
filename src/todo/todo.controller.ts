import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Todo } from './entities/todo.entity';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('todo')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @ApiOperation({ summary: 'Create a new todo for a user' })
  @ApiParam({ name: 'userId', description: 'User Id' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created',
    type: Todo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post(':userId')
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Param('userId')
    userId: number,
  ) {
    return this.todoService.create(createTodoDto, Number(userId));
  }

  @ApiOperation({ summary: 'Get all not completed todos for a user' })
  @ApiParam({ name: 'userId', description: 'User Id' })
  @ApiResponse({
    status: 200,
    description: 'Return all not completed todos',
    type: [Todo],
  })
  @Get('/findAllNotCompleted/:userId')
  findAllTodosByUserIdNotCompleted(@Param('userId') userId: number) {
    return this.todoService.findAllTodoByUserNotCompleted(userId);
  }
  @ApiOperation({ summary: 'Get all completed todos for a user' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Return all completed todos.',
    type: [Todo],
  })
  @Get('/findAllCompleted/:userId')
  findAllTodosByUserIdCompleted(@Param('userId') userId: number) {
    return this.todoService.findAllTodoByUserCompleted(userId);
  }

  @ApiOperation({ summary: 'Get a todo by Id' })
  @ApiParam({ name: 'id', description: 'Todo Id' })
  @ApiResponse({
    status: 200,
    description: 'Return the todo with the given Id.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todoService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a todo by Id' })
  @ApiParam({ name: 'id', description: 'Todo Id' })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
    type: Todo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @Patch(':id')
  update(@Param('id') id: number) {
    return this.todoService.update(+id);
  }

  @ApiOperation({ summary: 'Delete a todo by Id' })
  @ApiParam({ name: 'id', description: 'Todo Id' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
