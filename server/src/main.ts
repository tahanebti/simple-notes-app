import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './account/account.module';
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.setGlobalPrefix("api/v1");

  const options = new DocumentBuilder()
    .setTitle("Notes Demo Project")
    .setDescription(
      "By : taha nebti"
    )
    .setVersion("1.0")
    .addTag("Notes")
    .build();
  const apppDocument = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api", app, apppDocument);


  await app.listen(process.env.PORT || 3000);
}
bootstrap();
