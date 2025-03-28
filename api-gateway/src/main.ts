import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: ['http://localhost:5173'], // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Use IoAdapter for WebSocket support
  app.useWebSocketAdapter(new IoAdapter(app));

  // Ensure the API Gateway listens on a different port than the WebSocket server
  await app.listen(process.env.PORT ?? 3000); // Change to a different port, e.g., 3001
}
bootstrap();
