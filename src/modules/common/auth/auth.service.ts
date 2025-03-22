import { ERROR } from '@common/constants/error';
import { UNIT } from '@common/constants/unit';
import { createBadRequestResponse } from '@common/helpers/response.helper';
import { RequestBody } from '@common/interfaces/request';
import { User } from '@common/types/user.type';
import { AppConfigService } from '@config/app/config.service';
import { PrismaService } from '@config/database/prisma/config.service';
import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appConfig: AppConfigService,
    private readonly jwtService: JwtService,
    @Inject(REQUEST) private request: RequestBody,
  ) {}

  async whoAmI() {
    return this.request.user;
  }

  async register(payloads: {
    username: string;
    password: string;
    name: string;
  }) {
    const password = crypto
      .createHash('sha256')
      .update(payloads.password)
      .digest('hex');

    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username: payloads.username,
      },
    });

    if (usernameExists) throw createBadRequestResponse(ERROR.USERNAME_TAKEN);

    const user = await this.prisma.user.create({
      data: {
        username: payloads.username,
        password: password,
        name: payloads.name,
      },
    });

    return `User ${user.username} has been created with ID: ${user.id}`;
  }

  async login(payloads: { username: string; password: string }) {
    const password = crypto
      .createHash('sha256')
      .update(payloads.password)
      .digest('hex');

    console.log(password);

    const user: User = await this.prisma.user.findFirst({
      where: {
        username: payloads.username,
        password,
      },
      select: { username: true, id: true, name: true },
    });

    if (!user) throw createBadRequestResponse(ERROR.INVALID_CREDENTIALS);

    const token = this.jwtService.sign({ userId: user.id });
    const tokenExpiredAt = dayjs().add(
      this.appConfig.jwtExpiresInNumber.duration,
      UNIT[this.appConfig.jwtExpiresInNumber.unit],
    );

    await this.prisma.userSession.updateMany({
      where: { userId: user.id },
      data: { deletedAt: dayjs().toDate() },
    });

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenDigest: crypto.createHash('sha256').update(token).digest('hex'),
        expiredAt: tokenExpiredAt.toDate(),
      },
    });

    return { token, user };
  }
}
