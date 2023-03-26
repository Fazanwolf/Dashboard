import {
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { AuthRegisterDto } from '../_dto/auth-register.dto';
import { User } from '../_schemas/user.schema';
import { AuthLoginDto } from '../_dto/auth-login.dto';
import { AuthResetPasswordDto } from '../_dto/auth-reset-password.dto';
import { Cache } from 'cache-manager';
import { RedditService } from '../thirdparty/reddit.service';
import { DiscordService } from '../thirdparty/discord.service';
import { WakatimeService } from '../thirdparty/wakatime.service';
import { TokensService } from '../tokens/tokens.service';
import { Auth2Dto } from '../_dto/auth-2.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private discordService: DiscordService,
    private redditService: RedditService,
    private wakatimeService: WakatimeService,
    private tokensService: TokensService,
  ) {
  }

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
    const user: User = await this.userService.getOneByEmail(forgotPasswordDto.email);
    forgotPasswordDto['token'] = this.jwtService.sign({
      id: user._id,
      reset: true,
    });
    return await this.emailService.sendForgotMail(forgotPasswordDto);
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
    if (!isValid) throw new UnauthorizedException('Invalid password.');
    if (!user.verified) throw new UnauthorizedException('User not verified.');

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      personalKey: user.personalKey,
    };

    return {
      id: user._id,
      username: user.username,
      access_token: this.jwtService.sign(payload),
      adultContent: user.adultContent,
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

  async registerWith(dto: Auth2Dto) {
    let userPlatform;

    if (dto.platform == "discord") {
      userPlatform = await this.discordService.getUser(dto.token);
    } else if (dto.platform == "reddit") {
      userPlatform = await this.redditService.getUser(dto.token);
    } else if (dto.platform == "wakatime") {
      userPlatform = await this.wakatimeService.getUser(dto.token);
    }
    console.log(userPlatform);
    const user = await this.userService.getOneByEmail(userPlatform.email);
    if (user) throw new ForbiddenException('User already exists.');

    const newUser = await this.userService.create({
      username: userPlatform.username,
      email: userPlatform.email,
      password: dto.platform + userPlatform.id,
    });

    await this.userService.update(newUser._id, { verified: true });
    delete newUser.personalKey;
    delete newUser.password;
    return newUser;
  }

  async loginWith(dto: Auth2Dto) {
    let userPlatform;

    if (dto.platform == "discord") {
      userPlatform = await this.discordService.getUser(dto.token);
    } else if (dto.platform == "reddit") {
      userPlatform = await this.redditService.getUser(dto.token);
    } else if (dto.platform == "wakatime") {
      userPlatform = await this.wakatimeService.getUser(dto.token);
    }
    const user = await this.userService.getOneByEmail(userPlatform.email);
    if (!user) throw new NotFoundException('User not found');
    const isValid = await bcrypt.compare(dto.platform + userPlatform.id, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid login. Please register first.');

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      personalKey: user.personalKey,
    };

    if (dto.platform == "discord") {
      await this.tokensService.updateTokenOf(user._id, { discord: dto.token });
    } else if (dto.platform == "reddit") {
      await this.tokensService.updateTokenOf(user._id, { reddit: dto.token });
    } else if (dto.platform == "wakatime") {
      await this.tokensService.updateTokenOf(user._id, { wakatime: dto.token });
    }

    return {
      id: user._id,
      username: user.username,
      access_token: this.jwtService.sign(payload),
      adultContent: user.adultContent,
      expiresIn: 172800,
    };
  }
}