<!-- tạo auth -->
nest generate module auth
nest generate service auth
nest generate controller auth


**import thư viện**
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @types/passport-jwt @types/bcrypt --save-dev

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