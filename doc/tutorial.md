
# 🚀 **Ghi chú phát triển dự án đặt vé xem phim với NestJS**  

## **1️⃣ Khởi tạo dự án NestJS**  
📌 **Câu lệnh tạo dự án:**  
```sh
npm i -g @nestjs/cli
nest new movie-booking
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```
📌 **Cấu trúc ban đầu của dự án:**  
```
📦 cinema-booking
 ┣ 📂 src
 ┃ ┣ 📂 auth            # Xác thực & phân quyền
 ┃ ┃ ┣ 📜 auth.module.ts
 ┃ ┃ ┣ 📜 auth.service.ts
 ┃ ┃ ┣ 📜 auth.controller.ts
 ┃ ┃ ┣ 📜 jwt.strategy.ts
 ┃ ┃ ┗ 📜 local.strategy.ts
 ┃ ┣ 📂 users           # Quản lý người dùng
 ┃ ┃ ┣ 📜 users.module.ts
 ┃ ┃ ┣ 📜 users.service.ts
 ┃ ┃ ┣ 📜 users.controller.ts
 ┃ ┃ ┗ 📜 users.entity.ts
 ┃ ┣ 📂 movies          # Quản lý phim
 ┃ ┃ ┣ 📜 movies.module.ts
 ┃ ┃ ┣ 📜 movies.service.ts
 ┃ ┃ ┣ 📜 movies.controller.ts
 ┃ ┃ ┗ 📜 movies.entity.ts
 ┃ ┣ 📂 schedules       # Lịch chiếu phim
 ┃ ┃ ┣ 📜 schedules.module.ts
 ┃ ┃ ┣ 📜 schedules.service.ts
 ┃ ┃ ┣ 📜 schedules.controller.ts
 ┃ ┃ ┗ 📜 schedules.entity.ts
 ┃ ┣ 📂 bookings        # Đặt vé
 ┃ ┃ ┣ 📜 bookings.module.ts
 ┃ ┃ ┣ 📜 bookings.service.ts
 ┃ ┃ ┣ 📜 bookings.controller.ts
 ┃ ┃ ┗ 📜 bookings.entity.ts
 ┃ ┣ 📂 payments        # Thanh toán
 ┃ ┃ ┣ 📜 payments.module.ts
 ┃ ┃ ┣ 📜 payments.service.ts
 ┃ ┃ ┣ 📜 payments.controller.ts
 ┃ ┃ ┗ 📜 payments.entity.ts
 ┃ ┣ 📂 common          # Các helper và middleware dùng chung
 ┃ ┃ ┣ 📜 decorators.ts
 ┃ ┃ ┗ 📜 utils.ts
 ┃ ┣ 📂 database        # Cấu hình kết nối database
 ┃ ┃ ┣ 📜 database.module.ts
 ┃ ┃ ┣ 📜 database.service.ts
 ┃ ┃ ┗ 📜 entities.ts
 ┃ ┣ 📂 config          # Cấu hình môi trường
 ┃ ┃ ┣ 📜 config.module.ts
 ┃ ┃ ┗ 📜 config.service.ts
 ┃ ┣ 📜 main.ts         # File khởi chạy ứng dụng
 ┃ ┗ 📜 app.module.ts   # Module gốc của ứng dụng
 ┣ 📂 test              # Thư mục chứa file test
 ┣ 📜 .env              # Biến môi trường
 ┣ 📜 nest-cli.json     # Cấu hình NestJS CLI
 ┣ 📜 package.json      # Package Node.js
 ┣ 📜 tsconfig.json     # Cấu hình TypeScript
 ┗ 📜 README.md         # Hướng dẫn sử dụng

```
📌 **Chú thích:**  
- `main.ts` → Điểm khởi chạy chính của ứng dụng.  
- `app.module.ts` → Module chính của ứng dụng.  
- `app.controller.ts` → Xử lý request từ client.  
- `app.service.ts` → Logic nghiệp vụ.  

---
  // Cấu hình thư mục chứa file EJS
  ```sh
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

## **2️⃣ Cấu hình database (PostgreSQL + TypeORM)**  
📌 **Cài đặt thư viện kết nối Database:**  
```sh
npm install @nestjs/typeorm typeorm pg dotenv
```
📌 **Tạo file `.env` lưu thông tin database:**  
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=123456
DATABASE_NAME=movie_booking
```
📌 **Cấu hình kết nối trong `app.module.ts`**  
```ts
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```
📌 **Lệnh kiểm tra kết nối database:**  
```sh
npx typeorm migration:run
```

---

## **3️⃣ Tạo các thư viện Authentication (JWT)**
📌 **Cài đặt thư viện JWT và bcrypt:**  
```sh
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @types/passport-jwt @types/bcrypt --save-dev
```
📌 **Tạo module `auth` để xử lý đăng nhập:**  
```sh
nest generate module auth
nest generate service auth
nest generate controller auth
```
📌 **Cấu trúc sau khi tạo auth module:**  
```
📂 src/
 ┣ 📂 auth/
 ┃ ┣ 📜 auth.module.ts
 ┃ ┣ 📜 auth.service.ts
 ┃ ┗ 📜 auth.controller.ts
```
📌 **Cấu hình JWT trong `auth.module.ts`**  
```ts
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
})
export class AuthModule {}
```

---

## **4️⃣ Tạo API Movie & Booking**
📌 **Tạo module quản lý phim (`movies`)**  
```sh
nest generate module movies
nest generate service movies
nest generate controller movies
```
📌 **Tạo module đặt vé (`bookings`)**  
```sh
nest generate module bookings
nest generate service bookings
nest generate controller bookings
```
📌 **Cấu trúc sau khi tạo movies & bookings module:**  
```
📂 src/
 ┣ 📂 movies/
 ┃ ┣ 📜 movies.module.ts
 ┃ ┣ 📜 movies.service.ts
 ┃ ┗ 📜 movies.controller.ts
 ┣ 📂 bookings/
 ┃ ┣ 📜 bookings.module.ts
 ┃ ┣ 📜 bookings.service.ts
 ┃ ┗ 📜 bookings.controller.ts
```

---

## **5️⃣ Cài đặt Swagger để tạo API Docs**  
📌 **Cài đặt thư viện Swagger:**  
```sh
npm install @nestjs/swagger swagger-ui-express
```
📌 **Cấu hình Swagger trong `main.ts`**  
```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Movie Booking API')
    .setDescription('API đặt vé xem phim')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```
📌 **Chạy Swagger trên trình duyệt:**  
- Mở `http://localhost:3000/api`

---

## **📌 Tổng Kết Các Lệnh Quan Trọng**  
| 🏷️ Chức năng | 🛠 Câu lệnh |
|-------------|-----------|
| **Tạo dự án NestJS** | `nest new movie-booking` |
| **Cài đặt database PostgreSQL** | `npm install @nestjs/typeorm typeorm pg` |
| **Tạo module Authentication (JWT)** | `nest generate module auth` |
| **Cài đặt Swagger API Docs** | `npm install @nestjs/swagger` |
| **Chạy dự án NestJS** | `npm run start:dev` |
