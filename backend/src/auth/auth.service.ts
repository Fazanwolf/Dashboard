import {
  CACHE_MANAGER,
  ForbiddenException, Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { lastValueFrom } from 'rxjs';
import { UsersService } from '../user/users.service';
import { EmailService } from '../email/email.service';
import { AuthRegisterDto } from '../_dto/auth-register.dto';
import { User } from '../_schemas/user.schema';
import { AuthForgotPasswordDto } from '../_dto/auth-forgot-password.dto';
import { AuthLoginDto } from '../_dto/auth-login.dto';
import { AuthResetPasswordDto } from '../_dto/auth-reset-password.dto';
import { Cache } from 'cache-manager';
import { Auth0Dto } from '../_dto/Auth0.dto';
import { Auth0Service } from '../auth0/auth0.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private auth0Service: Auth0Service,
  ) {}

  async register(registerDto: AuthRegisterDto): Promise<User> {
    const user: User = await this.userService.create(registerDto);
    delete user.password;
    const payload = {
      id: user._id.toString(),
      email: user.email,
      verified: 'waiting',
      personalKey: user.personalKey,
    };
    delete user.personalKey;
    const token = this.jwtService.sign(payload);
    await this.emailService.sendValidationMail({
      email: user.email,
      token: token,
    });
    return user;
  }

  async confirmMail(token: string) {
    const { id, verified } = this.jwtService.decode(token) as { id; verified };

    if (verified != 'waiting') throw new UnauthorizedException('Invalid credentials.');

    const user: User = await this.userService.getOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (user.verified == true) throw new UnauthorizedException('User already verified.');

    await this.userService.update(id, { verified: true });
    return { confirmed: true };
  }

  async forgotPassword(forgotPasswordDto) {
    await this.emailService.sendForgotMail(forgotPasswordDto);
  }

  async resetPassword(query: AuthResetPasswordDto) {
    const { id, reset } = this.jwtService.decode(query.token) as {
      id;
      reset;
    };

    if (!reset) throw new UnauthorizedException('Invalid token.');

    const cached: User = await this.cacheManager.get(id);

    if (cached) {
      const { password } = cached;
      const isValid = await bcrypt.compare(query.password, password);
      if (!isValid) throw new UnauthorizedException('Invalid login.');
      return await this.userService.update(id, { password: query.password });
    }

    const user = await this.userService.getOne(id);
    if (!user) throw new NotFoundException('User not found');
    const { password } = user;
    const isValid = await bcrypt.compare(query.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid login.');
    return await this.userService.update(id, { password: query.password });
  }

  async login(loginDto: AuthLoginDto): Promise<any> {
    const user: User = await this.userService.getOneByEmail(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid login.');
    const { password } = user;
    const isValid = await bcrypt.compare(loginDto.password, password);
    if (!isValid) throw new UnauthorizedException('Invalid login.');

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      personalKey: user.personalKey,
    };

    return {
      id: user._id.toString(),
      username: user.username,
      access_token: this.jwtService.sign(payload),
      expiresIn: 172800,
    };
  }

  async logout(head) {
    const { id } = this.jwtService.decode(head) as { id };

    await this.userService.update(id, { personalKey: 'logout' });
    return {
      status: 'logout',
    };
  }

  async loginAuth0(dto: Auth0Dto): Promise<any> {
    const user0 = (await lastValueFrom(
      this.auth0Service.getUser(dto.client_id),
    )) as any;
    const user = await this.userService.getOneByEmail(user0.email);
    if (!user) throw new NotFoundException('User not found');
    const isValid = await bcrypt.compare('auth0' + user0.id, user.password);
    if (!isValid)
      throw new UnauthorizedException('Invalid login. Please register first.');

    console.log(user0);

    const payload = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      personalKey: user.personalKey,
    };

    return {
      id: user._id.toString(),
      username: user.username,
      access_token: this.jwtService.sign(payload),
      expiresIn: 172800,
    };
  }

  async registerAuth0(dto: Auth0Dto): Promise<any> {
    const user0 = (await lastValueFrom(
      this.auth0Service.getUser(dto.client_id),
    )) as any;
    const checkUser = await this.userService.getOneByEmail(user0.email);
    if (checkUser) throw new ForbiddenException('User already exists.');
    const user = await this.userService.create({
      username: user0.username,
      email: user0.email,
      password: 'auth0' + user0.id,
    });

    const payload = {
      id: user._id.toString(),
      email: user.email,
      verified: 'waiting',
      personalKey: user.personalKey,
    };

    const token = this.jwtService.sign(payload);
    await this.emailService.sendValidationMail({
      email: user.email,
      token: token,
    });
    delete user.personalKey;
    return user;
  }
}