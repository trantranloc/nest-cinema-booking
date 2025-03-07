import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('login')
  @Render('login')
  loginPage() {
    return {};
  }

  @Post('login')
  async login(@Body() loginDto: AuthDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() register: AuthDto) {
    return await this.authService.register(register.email, register.password);
  }
  // @Get('test-email')
  // async testEmail(@Query('email') email: string) {
  //   const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //   await this.authService.sendOtpEmail(email, otp);
  //   return { message: 'OTP sent!', otp };
  // }
  @Post('verify-otp')
  async verifyOtp(@Body() { email, otp }: { email: string; otp: string }) {
    return this.authService.verifyOtp(email, otp);
  }
}
