# NestJS Skeleton (Building block - foundation)

## Overview

Tenacity is a backend application built with [NestJS](https://nestjs.com/) and [Prisma](https://www.prisma.io/). It provides a modular architecture with a focus on scalability and maintainability.

## Features

- Modular structure with feature-based organization
- Prisma ORM for database management
- JWT authentication
- Custom decorators, filters, pipes, and helpers
- OpenAPI integration
- Configuration management

## Project Structure

```
.
├── prisma/                   # Database schema and migrations
│   ├── migrations/           # Prisma migrations
│   ├── migration_lock.toml   # Prisma migration lock file
│   └── schema.prisma         # Prisma schema definition
│
├── src/
│   ├── app.module.ts         # Root module
│   ├── main.ts               # Application entry point
│   ├── common/               # Shared utilities (constants, decorators, filters, helpers, etc.)
│   ├── config/               # Application and database configuration
│   ├── modules/              # Feature modules
│   │   ├── api/v1/dashboard  # API module (Dashboard)
│   │   ├── common/auth       # Authentication module
│   │   └── oapi              # OpenAPI endpoints
│
├── test/                     # Integration tests
├── nest-cli.json             # NestJS CLI configuration
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Installation

```sh
npm install
```

## Running the Application

### Development

```sh
npm run start:dev
```

### Production

```sh
npm run build
npm run start:prod
```

### Debug Mode

```sh
npm run start:debug
```

## Environment Variables

Create a `.env` file and configure required environment variables. Example:

```
DATABASE_URL=postgresql://user:password@localhost:5432/tenacity
JWT_SECRET=your_secret_key
```

## Database Migrations

Run Prisma migrations:

```sh
npx prisma migrate dev --name init
```

## Testing

Run unit tests:

```sh
npm run test
```

Run e2e tests:

```sh
npm run test:e2e
```

Check test coverage:

```sh
npm run test:cov
```

## Linting & Formatting

```sh
npm run lint
npm run format
```

## License

This project is **UNLICENSED**.
