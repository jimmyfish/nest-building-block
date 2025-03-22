import { Module } from '@nestjs/common';
import { PrismaService } from './config.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
