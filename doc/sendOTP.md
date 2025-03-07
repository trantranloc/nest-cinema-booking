## ✅ **Cách gửi mã OTP qua email khi đăng ký trong NestJS**  

### **1️⃣ Cài đặt thư viện gửi email**
Trước tiên, bạn cần cài thư viện **nodemailer** để gửi email:
```sh
npm install nodemailer
```

---
```sh thêm vào tsconfig.json 
 "strict": false,
    "noImplicitAny": false,
    "esModuleInterop": true

### **2️⃣ Cập nhật `auth.service.ts` để gửi OTP**
Thêm logic **tạo mã OTP**, **gửi email** và **lưu OTP vào database**.

📌 **`auth.service.ts`**  
```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại!');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mã OTP ngẫu nhiên (6 số)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu user vào database với OTP
    const newUser = this.userRepository.create({ email, password: hashedPassword, otp: otpCode });
    await this.userRepository.save(newUser);

    // Gửi email OTP
    await this.sendOtpEmail(email, otpCode);

    return { message: 'Vui lòng kiểm tra email để nhận mã OTP!' };
  }

  async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Thay bằng email của bạn
        pass: 'your-email-password', // Thay bằng mật khẩu ứng dụng Gmail
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Xác nhận đăng ký - Mã OTP',
      text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
  }
}
```
---

### **3️⃣ Thêm trường `otp` vào `User Entity`**
Cập nhật file `user.entity.ts` để lưu OTP vào database.

📌 **`user.entity.ts`**  
```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })  // OTP có thể null sau khi xác nhận
  otp: string;
}
```
---

### **4️⃣ Thêm API xác thực OTP**
Sau khi người dùng nhận OTP qua email, họ cần nhập mã OTP để kích hoạt tài khoản.

📌 **Cập nhật `auth.service.ts` để xác minh OTP**
```typescript
async verifyOtp(email: string, otp: string) {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user || user.otp !== otp) {
    throw new BadRequestException('Mã OTP không hợp lệ!');
  }

  // Xác thực thành công => Xóa OTP
  user.otp = null;
  await this.userRepository.save(user);

  return { message: 'Xác minh OTP thành công! Bạn có thể đăng nhập.' };
}
```

📌 **Thêm API xác minh OTP vào `auth.controller.ts`**
```typescript
@Post('verify-otp')
async verifyOtp(@Body() { email, otp }: { email: string; otp: string }) {
  return this.authService.verifyOtp(email, otp);
}
```
---

### **🔥 Test trên Postman**
#### **1️⃣ Đăng ký tài khoản (Gửi OTP)**
- **Phương thức:** `POST`
- **URL:** `http://localhost:3000/auth/register`
- **Body (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "password": "123456"
  }
  ```
- **Kết quả mong đợi** (OTP được gửi về email):
  ```json
  {
    "message": "Vui lòng kiểm tra email để nhận mã OTP!"
  }
  ```

#### **2️⃣ Xác minh OTP**
- **Phương thức:** `POST`
- **URL:** `http://localhost:3000/auth/verify-otp`
- **Body (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "otp": "123456"
  }
  ```
- **Kết quả thành công**:
  ```json
  {
    "message": "Xác minh OTP thành công! Bạn có thể đăng nhập."
  }
  ```

---

## **🎯 Kết luận**
✅ **Đăng ký tài khoản**, gửi **OTP qua email**  
✅ **Xác minh OTP trước khi cho phép đăng nhập**  
✅ **Bảo mật bằng mã OTP ngẫu nhiên**  

🚀 **Bạn có muốn thêm thời gian hết hạn cho OTP không?** ⏳


🔧 Cách khắc phục khi không có "Chọn ứng dụng: Mail"
Bước 1: Bật Xác minh 2 bước (2-Step Verification)
Truy cập: 👉 Google Security
Tìm mục: Signing in to Google (Đăng nhập vào Google).
Nhấp vào: 2-Step Verification (Xác minh 2 bước).
Làm theo hướng dẫn để bật Xác minh 2 bước bằng số điện thoại hoặc ứng dụng Google Authenticator.
Bước 2: Tạo App Password (Mật khẩu ứng dụng)
Sau khi bật 2-Step Verification:

Truy cập lại: 👉 Google App Passwords
Nhập mật khẩu Google nếu được yêu cầu.
Tại "Select app" (Chọn ứng dụng):
Nếu không thấy "Mail", chọn "Other (Custom name)".
Nhập tên bất kỳ (VD: NestJS SMTP) rồi nhấn Generate.
Sao chép mật khẩu ứng dụng (16 ký tự) và sử dụng trong nodemailer.
📌 Lưu ý: Nếu vẫn không thấy App Passwords, có thể do:

Tài khoản của bạn là Google Workspace (công ty/quản trị viên đã tắt tính năng này).
Tài khoản mới tạo gần đây (Google có thể hạn chế trong thời gian đầu).
Bước 3: Cập nhật mật khẩu trong nodemailer
Dùng mật khẩu ứng dụng thay vì mật khẩu Google: