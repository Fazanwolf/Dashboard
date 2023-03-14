import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthResetPasswordDto } from '../_dto/auth-reset-password.dto';
import { AuthForgotPasswordDto } from '../_dto/auth-forgot-password.dto';
import { AuthRegisterDto } from '../_dto/auth-register.dto';
import { AuthLoginDto } from '../_dto/auth-login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verifyAccount/:token')
  @ApiOperation({ summary: 'Validate the user' })
  @ApiOkResponse({ description: 'User has been validated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  validate(@Param('token') token: string) {
    return this.authService.confirmMail(token);
  }

  @Get('resetPassword')
  @ApiOperation({ summary: 'Reset the password of the user' })
  @ApiOkResponse({ description: 'Password changed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiQuery({ name: 'token', required: true, type: String })
  @ApiQuery({ name: 'password', required: true, type: String })
  resetPassword(@Query() query: AuthResetPasswordDto) {
    return this.authService.resetPassword(query);
  }

  @Post('forgotPassword')
  @ApiOperation({ summary: 'Launch the process to reset password' })
  @ApiOkResponse({ description: 'Mail sent' })
  forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register the user' })
  @ApiCreatedResponse({ description: 'User has been successfully logged' })
  @ApiBadRequestResponse({
    description:
      "Missing field, email is not an email, password doesn't match password policy",
  })
  @ApiForbiddenResponse({ description: 'User already exists' })
  @HttpCode(201)
  register(@Body() registerDto: AuthRegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login the user and retrieve the JWT token' })
  @ApiOkResponse({ description: 'User has been successfully registered' })
  @ApiBadRequestResponse({
    description: 'Missing field or email is not an email',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout the user' })
  @ApiOkResponse({ description: 'User has been successfully logout' })
  @ApiBearerAuth()
  logout(@Headers() head) {
    // return this.authService.logout(head['authorization'].split(' ')[1]);
  }

  // @Post('0/register')
  // @ApiOkResponse({ description: 'User has been successfully registered' })
  // @ApiBadRequestResponse({
  //   description: 'Missing field',
  // })
  // async auth0Register(@Body() dto: Auth0Dto) {
  //   return await this.authService.registerWithAuth0(dto);
  // }

  // @Post('0/login')
  // @ApiOkResponse({ description: 'User has been successfully logged' })
  // @ApiBadRequestResponse({
  //   description: 'Missing field',
  // })
  // async auth0Login(@Body() dto: Auth0Dto) {
  //   return await this.authService.loginWithAuth0(dto);
  // }
}