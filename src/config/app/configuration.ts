import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    url: process.env.DATABASE_URL || null,
  },
  port: process.env.APP_PORT || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  bcrypt: {
    saltOrRounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  },
}));
