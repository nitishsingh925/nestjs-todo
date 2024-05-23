import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.auth.dto';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiBody({ type: loginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('/login')
  async login(@Body() loginDto: loginDto, @Res() res: Response) {
    try {
      const user = await this.authService.validateUser(loginDto);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { userId: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      const COOKIE_OPTIONS = {
        httpOnly: true,
        secure: true,
        maxAge: 3600000, // 1 hour
      };
      res.cookie('accessToken', accessToken, COOKIE_OPTIONS);
      return res.json({ accessToken, payload });
    } catch (error) {
      throw new InternalServerErrorException(
        `An error occurred during login: ${error.message}`,
      );
    }
  }
}
