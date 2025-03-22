import { createSuccessResponse } from '@common/helpers/response.helper';
import { RequestBody } from '@common/interfaces/request';
import { Controller, Get, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(@Inject(REQUEST) private readonly request: RequestBody) {}
  @Get()
  async getDashboard() {
    return createSuccessResponse({
      message: `Hello, ${this.request.user?.name}!`,
    });
  }
}
