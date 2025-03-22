import { Public } from '@common/decorators/header.decorator';
import { createSuccessResponse } from '@common/helpers/response.helper';
import { ZodValidationPipe } from '@common/pipes/zod.pipe';
import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, LoginSchema, RegisterDto, RegisterSchema } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) body: RegisterDto,
  ) {
    return createSuccessResponse(
      await this.authService.register({
        username: body.username,
        password: body.password,
        name: body.name,
      }),
    );
  }

  @Public()
  @Post('login')
  async login(@Body(new ZodValidationPipe(LoginSchema)) body: LoginDto) {
    return createSuccessResponse(
      await this.authService.login({
        username: body.username,
        password: body.password,
      }),
    );
  }
}
