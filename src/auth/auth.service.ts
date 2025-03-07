/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './auth.dto';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}
  // Đăng Nhập
  async login(login: AuthDto) {
    if (!login.email || !login.password) {
      throw new BadRequestException('Email hoặc Password đang trống');
    }
    const user = await this.userRepository.findOne({
      where: { email: login.email },
    });
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    const isMatch = await bcrypt.compare(login.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Sai mật khẩu');
    }
    const payload = { email: user.email, id: user.id };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
  // Đăng Ký
  async register(email: string, password: string) {
    console.log('📩 Email nhận được:', email);

    // Kiểm tra email có giá trị hợp lệ không
    if (!email) {
      throw new BadRequestException('Email không được để trống!');
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadRequestException('Email đã tồn tại!');
    }

    //   Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    //   Tạo mã OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Tạo người dùng mới
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
      otp: otpCode,
    });

    // Lưu vào database
    await this.userRepository.save(newUser);

    // Gửi email OTP
    await this.sendOtpEmail(email, otpCode);

    return { message: 'Vui lòng kiểm tra email để nhận mã OTP!' };
  }

  // Gửi email OTP
  async sendOtpEmail(email: string, otp: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tran101513@donga.edu.vn',
        pass: 'dyom qimk vuek qwgy',
      },
    });

    const mailOptions = {
      from: 'Cinema Booking',
      to: email,
      subject: 'Xác nhận đăng ký - Mã OTP',
      text: `Mã OTP của bạn là: ${otp}.`,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await transporter.sendMail(mailOptions);
  }
  async verifyOtp(email: string, otp: string) {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || user.otp !== otp) {
      throw new BadRequestException('Mã OTP không hợp lệ!');
    }

    // Xác thực thành công => Xóa OTP
    user.otp = '';
    await this.userRepository.save(user);

    return { message: 'Xác minh OTP thành công! Bạn có thể đăng nhập.' };
  }
}
