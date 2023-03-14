import { Model } from 'mongoose';
import { CACHE_MANAGER, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from "../_schemas/user.schema";
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDto } from "../_dto/user-create.dto";
import { UserUpdateDto } from "../_dto/user-update.dto";
import { Cache } from "cache-manager";
import { JwtService } from '@nestjs/jwt';
import { jwt } from '../_tools/Config';
import * as bcrypt from "bcrypt";
import { AuthRegisterDto } from '../_dto/auth-register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
  ) {}

  async manageUserCache(id: string) {
    const cachedUser = await this.cacheManager.get<User>(id);
    if (cachedUser) return cachedUser;
    return null
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, jwt.salt_round);
  }

  async create(createUserDto: UserCreateDto | AuthRegisterDto): Promise<User> {
    const checkEmail = await (await this.userModel.find({email: createUserDto.email}).exec())[0];
    if (checkEmail) throw new ForbiddenException("Email already taken.");
    const createdUser = new this.userModel(createUserDto);
    createdUser.personalKey = await bcrypt.genSalt(jwt.salt_round);
    createdUser.password = await this.hashPassword(createdUser.password);
    return createdUser.save();
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getOne(id: string) {
    const cached: User = await this.manageUserCache(id);
    if (cached) return cached;
    const user: User = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found.");
    return user;
  }

  async getOneByEmail(email: string): Promise<User> {
    const user = (await this.userModel.find({email: email}).exec())[0];
    if (!user) throw new ForbiddenException("Unknown email.");
    return user;
  }

  async update(id: string, updateUserDto: UserUpdateDto) {
    const cached: User = await this.manageUserCache(id);

    if (updateUserDto.personalKey && updateUserDto.personalKey === 'logout')
      updateUserDto.personalKey = await bcrypt.genSalt(jwt.salt_round);
    if (updateUserDto.password) updateUserDto.password = await this.hashPassword(updateUserDto.password);

    if (cached) {
      if (cached.email == updateUserDto.email && cached._id != id) throw new ForbiddenException("Email already exists.");
      cached.password = await this.hashPassword(cached.password);
      const userUpdated: User = await this.userModel.findByIdAndUpdate(cached._id, updateUserDto).exec();
      await this.cacheManager.set(id, userUpdated);
      return userUpdated;
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found.");
    if (user.email == updateUserDto.email && user._id != id) throw new ForbiddenException("Email already exists.");
    const userUpdated = await this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
    await this.cacheManager.set(id, userUpdated);
    return userUpdated;
  }

  async delete(id: string) {
    const cached: User = await this.manageUserCache(id);
    if (cached) await this.cacheManager.del(id);
    const user: User = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException("User not found.");
    return await this.userModel.findByIdAndDelete(id).exec();
  }

}
