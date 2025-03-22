import { createBadRequestResponse } from '@common/helpers/response.helper';
import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        return createBadRequestResponse({
          code: 10001,
          message: error.message,
        });
      }

      throw error;
    }
  }
}
