import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export interface SuccessResponse<T = any> {
  status: string;
  data: T;
  meta: { pagination?: any };
}

export interface FailureResponse {
  status: string;
  code: number;
  message: string;
}

export const createSuccessResponse = <T = any>(
  data: T,
  meta?: {
    pagination?: {
      page: number;
      perPage: number;
      totalPages: number;
      total: number;
    };
    country?: {
      id: string;
      name: string;
      isoCode: string;
      pic: string;
      accent: string;
    };
    lang?: string;
    language?: string;
  },
): SuccessResponse<T> => {
  return {
    status: 'success',
    data,
    meta,
  };
};

export const createUnauthorizedResponse = (
  message: string,
  code: number,
): FailureResponse => {
  throw new UnauthorizedException({
    status: 'error',
    message,
    code,
  });
};

export const createBadRequestResponse = (returns: {
  code: number;
  message: string | { path: (string | number)[]; message: string }[];
}): FailureResponse => {
  const { message, code } = returns;

  throw new BadRequestException({
    status: 'error',
    message,
    code,
  });
};
