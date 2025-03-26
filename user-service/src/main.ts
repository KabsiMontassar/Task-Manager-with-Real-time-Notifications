import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Transport } from '@nestjs/microservices';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configure microservice
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });

  // Start microservice
  await app.startAllMicroservices();
  
  // Start HTTP server on a different port
  await app.listen(process.env.HTTP_PORT ?? 3001);
}
bootstrap();
