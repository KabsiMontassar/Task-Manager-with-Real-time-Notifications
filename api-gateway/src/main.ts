import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Ensure the API Gateway listens on its designated port
  await app.listen(process.env.PORT ?? 3000).catch((err) => {
    console.error('Error starting the server:', err);
  });
}
bootstrap().catch((error) => {
  console.error('Error during app bootstrap:', error);
  process.exit(1); // Exit process on failure
});
