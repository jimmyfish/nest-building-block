import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const IS_BASIC_GUARDED = 'isBasicGuarded';
export const BasicGuarded = () => SetMetadata(IS_BASIC_GUARDED, true);
