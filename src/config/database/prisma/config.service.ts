import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      let deletedOverriden = params.args?.where?.deletedAt !== undefined;

      if (
        params.args?.where?.OR?.some(
          (condition: any) => condition.deletedAt !== undefined,
        )
      ) {
        deletedOverriden = true;
      }

      if (['findMany', 'findFirst', 'findUnique'].includes(params.action)) {
        if (!deletedOverriden) {
          params.args.where = {
            ...params.args.where,
            deletedAt: null,
          };
        }
      }

      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
