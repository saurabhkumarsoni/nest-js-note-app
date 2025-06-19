import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS to allow Angular frontend to access the backend
  app.enableCors({
    origin: 'http://localhost:4200', // Angular dev server URL
    credentials: true,
  });

  // ✅ Global error handling filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('API for user-authenticated note-taking')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
void bootstrap();
