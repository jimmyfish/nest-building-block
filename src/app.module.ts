import { AppConfigModule } from '@config/app/config.module';
import { DashboardModule } from '@modules/api/v1/dashboard/dashboard.module';
import { AuthModule } from '@modules/common/auth/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, AuthModule, DashboardModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
