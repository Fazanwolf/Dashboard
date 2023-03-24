import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [
    UsersModule,
    ServicesModule
  ],
  controllers: [AdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}