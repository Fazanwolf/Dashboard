import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Token, TokenDocument } from '../_schemas/token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TokenUpdateDto } from '../_dto/token-update.dto';
import { TokenCreateDto } from '../_dto/token-create.dto';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {}

  async createToken(tokenDto: TokenCreateDto) {
    const usersToken = await this.tokenModel.findOne({ 'user': tokenDto.user }).exec();
    if (usersToken) throw new ForbiddenException("User already has tokens.");
    const token = new this.tokenModel(tokenDto);
    return token.save();
  }

  async deleteTokenOf(id: string) {
    const user = await this.getTokenOf(id);
    if (!user) throw new NotFoundException("User not found.");
    return await this.tokenModel.findByIdAndDelete(user._id).exec();
  }

  async getTokens(): Promise<Token[]> {
    return await this.tokenModel.find().exec();
  }

  async getTokenOf(id: string): Promise<Token> {
    const usersToken = (await this.tokenModel.find({ user: id }).exec())[0];
    if (!usersToken) throw new NotFoundException("User not found.");
    return usersToken
  }

  async updateTokenOf(id: string, tokenDto: TokenUpdateDto): Promise<Token> {
    const getToken = await this.getTokenOf(id);
    if (!getToken) throw new NotFoundException("User not found.");
    return await this.tokenModel.findByIdAndUpdate(getToken._id, tokenDto).exec();
  }

}