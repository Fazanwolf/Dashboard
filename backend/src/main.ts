import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port } from 'src/_tools/Config';
import { ValidationPipe } from '@nestjs/common';
import { MeModule } from './me/me.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';
import { WidgetsModule } from './widgets/widgets.module';
import { AdminModule } from './admin/admin.module';
import { ThirdpartyModule } from './thirdparty/thirdparty.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const userConfig = new DocumentBuilder()
    .setTitle('Dashboard - User API')
    .setDescription('The best API for the best project!')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const adminConfig = new DocumentBuilder()
    .setTitle('Dashboard - Admin API')
    .setDescription('The best API for the best project!')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const userDocument = SwaggerModule.createDocument(app, userConfig, { include: [MeModule, AuthModule]});
  SwaggerModule.setup('api/user', app, userDocument, {
    customfavIcon:
      'https://cdn.discordapp.com/attachments/928272073237876746/1040534863402520576/logo.svg\n',
    customSiteTitle: 'Dashboard - User API',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      apisSorter: 'alpha',
      schemaSorter: 'alpha',
    },
  });

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, { include: [ServicesModule, UsersModule, TokensModule, WidgetsModule, AuthModule, AdminModule, ThirdpartyModule]});
  SwaggerModule.setup('api/admin', app, adminDocument, {
    customfavIcon:
      'https://cdn.discordapp.com/attachments/928272073237876746/1040534863402520576/logo.svg\n',
    customSiteTitle: 'Dashboard - Admin API',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      apisSorter: 'alpha',
      schemaSorter: 'alpha',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  });
  await app.listen(port);
}

bootstrap();