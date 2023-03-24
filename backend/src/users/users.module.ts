import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from "../_schemas/user.schema";
import { jwt } from '../_tools/Config';
import { JwtModule } from '@nestjs/jwt';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TokensModule,
    JwtModule.register({
      secret: `${jwt.secret}`,
      signOptions: { expiresIn: `${jwt.expire}` },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
