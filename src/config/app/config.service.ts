import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('app.database.url');
  }

  get port(): number {
    return Number(this.configService.get<string>('app.port'));
  }

  get jwtSecret(): string {
    return this.configService.get<string>('app.jwt.secret');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('app.jwt.expiresIn');
  }

  get jwtExpiresInNumber(): { duration: number; unit: string } {
    return {
      duration: Number(this.jwtExpiresIn.replace(/\D/g, '')),
      unit: this.jwtExpiresIn.replace(/\d/g, ''),
    };
  }

  get bcryptSaltOrRounds(): number {
    return Number(this.configService.get<string>('app.bcrypt.saltOrRounds'));
  }
}
