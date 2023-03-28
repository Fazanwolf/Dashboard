import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  Param,
  Query,
  Headers, CacheKey, CacheTTL, Res,
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
import { Auth2Dto } from '../_dto/auth-2.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
@ApiUnauthorizedResponse({ description: 'Invalid credentials' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('verifyAccount')
  @ApiOperation({ summary: 'Validate the users' })
  @ApiOkResponse({ description: 'User has been validated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiQuery({ name: 'token', required: true })
  @ApiQuery({ name: 'redirect_uri', required: false })
  async validate(@Query() query: {token: string, redirect_uri?: string}, @Res() res) {
    await this.authService.confirmMail(query.token);
    return res.redirect('http://localhost:8081/login' || query.redirect_uri);
  }

  @Post('resetPassword')
  @ApiOperation({ summary: 'Reset the password of the users' })
  @ApiOkResponse({ description: 'Password changed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async resetPassword(@Body() body: AuthResetPasswordDto) {
    const result = await this.authService.resetPassword(body);
    if (result) return { message: 'Password changed', }
    return { message: 'Something goes wrong', }
  }

  @Post('forgotPassword')
  @ApiOperation({ summary: 'Launch the process to reset password' })
  @ApiOkResponse({ description: 'Mail sent' })
  async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
    const res = await this.authService.forgotPassword(forgotPasswordDto);
    if (res) return { message: 'Mail sent', }
    return { message: 'Something goes wrong', }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register the users' })
  @ApiCreatedResponse({ description: 'User has been successfully logged' })
  @ApiBadRequestResponse({
    description:
      "Missing field, email is not an email, password doesn't match password policy",
  })
  @ApiForbiddenResponse({ description: 'User already exists' })
  @HttpCode(201)
  async register(@Body() registerDto: AuthRegisterDto) {
    const res = await this.authService.register(registerDto);
    if (res) return { message: 'User has been successfully registered', }
    return { message: 'Something goes wrong', }
  }

  @Post('login')
  @CacheKey("token")
  @CacheTTL((1000*(60^2))*48)
  @ApiOperation({ summary: 'Login the users and retrieve the JWT token' })
  @ApiOkResponse({ description: 'User has been successfully registered' })
  @ApiBadRequestResponse({
    description: 'Missing field; Invalid email or password',
  })
  @HttpCode(200)
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  login(@Body() loginDto: AuthLoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout the users' })
  @ApiOkResponse({ description: 'User has been successfully logout' })
  @ApiBearerAuth()
  logout(@Headers() head) {
    return this.authService.logout(head['authorization'].split(' ')[1]);
  }

  @Post('o2/register')
  @ApiCreatedResponse({ description: 'User has been successfully registered' })
  @ApiBadRequestResponse({
    description: 'Missing field: token or platform',
  })
  @HttpCode(201)
  async oauth2Register(@Body() dto: Auth2Dto) {
    const res = await this.authService.registerWith(dto);
    if (res) return { message: 'User has been successfully registered', }
    return { message: 'Something goes wrong', }
  }

  @Get('o2/register')
  @ApiCreatedResponse({ description: 'User has been successfully registered' })
  @ApiBadRequestResponse({
    description: 'Missing field: token or platform',
  })
  @ApiQuery({ name: 'token', required: false, type: String })
  @ApiQuery({ name: 'platform', required: false, type: String })
  @HttpCode(201)
  async oauth2RegisterFromQuery(@Query() query, @Res() res) {
    const data = await this.authService.registerWith(query);
    res.redirect(`http://localhost:8081/login`);
  }

  @Post('o2/login')
  @ApiOkResponse({ description: 'User has been successfully logged' })
  @ApiBadRequestResponse({
    description: 'Missing field: token or platform',
  })
  @ApiQuery({ name: 'token', required: false, type: String })
  @ApiQuery({ name: 'platform', required: false, type: String })
  @HttpCode(200)
  async oauth2Login(@Body() dto: Auth2Dto, @Query() query) {
    await this.authService.loginWith(dto);
  }

  @Get('o2/login')
  @ApiOkResponse({ description: 'User has been successfully logged' })
  @ApiBadRequestResponse({
    description: 'Missing field: token or platform',
  })
  @ApiQuery({ name: 'token', required: false, type: String })
  @ApiQuery({ name: 'platform', required: false, type: String })
  @HttpCode(200)
  async oauth2LoginFromQuery(@Query() query, @Res() res: Response) {
    try {
      const data = await this.authService.loginWith(query);
      res.redirect(`http://localhost:8081/login?access_token=${data.access_token}&id=${data.id}&username=${data.username}&adultContent=${data.adultContent}&rateLimit=${data.rateLimit}`);
    } catch (error) {
      res.redirect(`http://localhost:8081/login`);
    }
    // res.header('Authorization', `Bearer ${data.access_token}`);
  }

}