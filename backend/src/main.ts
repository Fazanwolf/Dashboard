import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port } from 'src/_tools/Config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Area API')
    .setDescription('The best API for the best project!')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customfavIcon:
      'https://cdn.discordapp.com/attachments/928272073237876746/1040534863402520576/logo.svg\n',
    customSiteTitle: 'Dashboard API',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      apisSorter: 'alpha',
      schemaSorter: 'alpha',
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port);
}

bootstrap();