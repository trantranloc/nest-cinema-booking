import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path'; // Import thêm module path
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Cấu hình thư mục chứa file EJS
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`
  );
}
void bootstrap();
