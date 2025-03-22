import {
  IS_BASIC_GUARDED,
  IS_PUBLIC_KEY,
} from '@common/decorators/header.decorator';
import { AppConfigService } from '@config/app/config.service';
import { PrismaService } from '@config/database/prisma/config.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  IS_PUBLIC: boolean;
  IS_BASIC_GUARDED: boolean;

  constructor(
    private jwtService: JwtService,
    private readonly configService: AppConfigService,
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.IS_PUBLIC = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.IS_BASIC_GUARDED = this.reflector.getAllAndOverride<boolean>(
      IS_BASIC_GUARDED,
      [context.getHandler(), context.getClass()],
    );

    if (this.IS_PUBLIC) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();

    if (this.IS_BASIC_GUARDED) {
      return await this.handleBasicAuth(token);
    }

    return await this.handleJwtAuth(token, request);
  }

  private async handleBasicAuth(token: string): Promise<boolean> {
    let username: string, password: string;
    try {
      [username, password] = Buffer.from(token, 'base64')
        .toString('utf-8')
        .split(':');
      if (!username || !password) throw new UnauthorizedException();
    } catch {
      throw new UnauthorizedException('Invalid Basic Auth token format');
    }

    const basicConfig: { count: number }[] = await this.prisma.$queryRaw<
      { count: number }[]
    >`
        SELECT count(id)
        FROM configs
        WHERE key = 'internal_basic_auth'
          AND (value::jsonb) ->> 'username' = ${username}
          AND (value::jsonb) ->> 'password' = ${password};
    `;

    if (basicConfig[0].count <= 0) throw new UnauthorizedException();

    return true;
  }

  private async handleJwtAuth(
    token: string,
    request: Request,
  ): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.jwtSecret,
      });
      const wherePayload = {
        userId: payload.userId,
        tokenDigest: crypto.createHash('sha256').update(token).digest('hex'),
        deletedAt: null,
        expiredAt: { gte: dayjs().toDate() },
      };
      const userSession = await this.prisma.userSession.findFirst({
        where: wherePayload,
        select: { id: true },
        orderBy: { createdAt: 'desc' },
      });
      if (!userSession) throw new UnauthorizedException();
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
      });
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
    } catch {
      if (this.IS_PUBLIC) return true;
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return ['Bearer', 'Basic'].includes(type) ? token : undefined;
  }
}
