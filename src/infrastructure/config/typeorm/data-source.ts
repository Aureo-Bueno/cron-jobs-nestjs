import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Todo } from '../../entities/todo.entity';
import { User } from '../../entities/user.entity';

dotenv.config({ path: './local.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA,
  entities: [Todo, User],
  migrations: [path.join(__dirname, 'migrations/**/*{.ts,.js}')],
  synchronize: false,
});

export default AppDataSource;
