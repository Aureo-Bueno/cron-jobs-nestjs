# Cron Jobs NestJS

## Overview
NestJS API with:
- JWT auth (access + refresh cookies)
- Todo CRUD
- Scheduled tasks (cron jobs)
- PostgreSQL persistence with TypeORM migrations

## Architecture
- Controllers: `src/infrastructure/controllers`
- Use cases: `src/usecases`
- Repositories: `src/infrastructure/repositories`
- Entities: `src/infrastructure/entities`
- Scheduled tasks: `src/task`

## Requirements
- Node.js
- npm or yarn
- PostgreSQL (local or Docker)

## Environment
For local dev the app reads `local.env` when `NODE_ENV=local` (used by `npm run start:dev`).

Example `local.env`:
```env
NODE_ENV=local
JWT_SECRET=dev_jwt_secret
JWT_EXPIRATION_TIME=3600
JWT_REFRESH_TOKEN_SECRET=dev_jwt_refresh_secret
JWT_REFRESH_TOKEN_EXPIRATION_TIME=604800
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=cron_jobs
DATABASE_SCHEMA=public
DATABASE_SYNCHRONIZE=false
```

Notes:
- Expiration values are in seconds.
- Use `DATABASE_HOST=localhost` when the API runs on your host.
- Use `DATABASE_HOST=postgres` when the API runs inside Docker Compose.

## Database (Docker)
```bash
docker compose up -d
```
The container name is `cron-jobs-nestjs_bd`, and the port maps from `DATABASE_PORT`.

## Install
```bash
yarn install
```

## Run
```bash
# development
yarn start

# watch mode
yarn start:dev

# production
yarn start:prod
```

App listens on `http://localhost:3000` by default.

## Migrations
```bash
# generate migration
yarn migration:generate --name=init

# run pending migrations
yarn migration:run

# revert last migration
yarn migration:revert

# show migration status
yarn migration:show

# create empty migration
yarn migration:create --name=empty
```

Notes:
- Migrations run on app startup (`migrationsRun: true` in `TypeOrmConfigModule`).
- `synchronize` is disabled in runtime config; prefer migrations.

## API
Base prefix: `/api_v1`

Swagger UI (non-production): `http://localhost:3000/api`

Auth:
- `POST /api_v1/auth/login` (sets cookies)
- `POST /api_v1/auth/logout`
- `GET /api_v1/auth/is_authenticated`
- `GET /api_v1/auth/refresh`

Todos:
- `GET /api_v1/todo/todos`
- `GET /api_v1/todo/todo?id=1`
- `POST /api_v1/todo/todo`
- `PUT /api_v1/todo/todo`
- `DELETE /api_v1/todo/todo?id=1`

Tasks:
- `TaskService` runs every 30 seconds and logs:
  - Done todos (`isDone = true`)
  - Users with `lastLogin` older than 7 days
- `GET /api_v1` logs next cron execution times

## Tests
```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# coverage
yarn test:cov
```

## Lint and Format
```bash
yarn lint
yarn format
```
