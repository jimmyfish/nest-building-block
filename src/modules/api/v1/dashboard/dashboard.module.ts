import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [JwtModule.register({})],
  providers: [],
  controllers: [DashboardController],
})
export class DashboardModule {}
